# Terraform Configuration for Intranet Proyectos
# AWS Infrastructure as Code

terraform {
  required_version = ">= 0.12"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
  
  default_tags {
    tags = {
      Project     = "intranet-proyectos"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# Variables
variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "intranet-proyectos"
}

variable "environment" {
  description = "Ambiente de deployment"
  type        = string
  default     = "production"
}

variable "db_username" {
  description = "Usuario de base de datos"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Contraseña de base de datos"
  type        = string
  sensitive   = true
}

variable "admin_email" {
  description = "Email del administrador"
  type        = string
}

# VPC Configuration (opcional, si no existe)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS MySQL instance"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
    description = "MySQL access from VPC"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# RDS Parameter Group
resource "aws_db_parameter_group" "main" {
  name   = "${var.project_name}-mysql-params"
  family = "mysql8.0"

  parameter {
    name  = "sql_mode"
    value = "STRICT_TRANS_TABLES"
  }

  tags = {
    Name = "${var.project_name}-mysql-params"
  }
}

# RDS Primary Instance
resource "aws_db_instance" "primary" {
  identifier             = "${var.project_name}-db-primary"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  max_allocated_storage  = 100
  storage_type           = "gp2"
  storage_encrypted       = true

  db_name  = "proyectos_intranet"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "${var.project_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  enabled_cloudwatch_logs_exports = ["error", "general", "slow_query"]

  tags = {
    Name = "${var.project_name}-db-primary"
  }
}

# RDS Read Replica
resource "aws_db_instance" "replica" {
  identifier             = "${var.project_name}-db-replica"
  replicate_source_db    = aws_db_instance.primary.identifier
  instance_class         = "db.t3.micro"
  publicly_accessible    = false

  vpc_security_group_ids = [aws_security_group.rds.id]

  skip_final_snapshot = true

  tags = {
    Name = "${var.project_name}-db-replica"
  }
}

# Security Group for ElastiCache
resource "aws_security_group" "elasticache" {
  name        = "${var.project_name}-elasticache-sg"
  description = "Security group for ElastiCache Redis"

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"]
    description = "Redis access from VPC"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-elasticache-sg"
  }
}

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-cache-subnet-group"
  subnet_ids = data.aws_subnets.default.ids
}

# ElastiCache Redis Cluster
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.project_name}-redis"
  description                = "Redis cluster for Celery broker"

  engine               = "redis"
  engine_version       = "6.x"
  node_type            = "cache.t3.micro"
  port                 = 6379
  parameter_group_name = "default.redis6.x"

  num_cache_clusters = 1

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.elasticache.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = false

  automatic_failover_enabled = false
  multi_az_enabled          = false

  snapshot_retention_limit = 5
  snapshot_window        = "03:00-05:00"

  tags = {
    Name = "${var.project_name}-redis"
  }
}

# S3 Bucket for Static and Media Files
resource "aws_s3_bucket" "app_storage" {
  bucket = "${var.project_name}-${var.environment}-storage"

  tags = {
    Name = "${var.project_name}-storage"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Server Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets  = true
}

# S3 Bucket Lifecycle Configuration
resource "aws_s3_bucket_lifecycle_configuration" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  rule {
    id     = "delete_old_versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }

  rule {
    id     = "transition_to_ia"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
  }
}

# IAM Role for Elastic Beanstalk
resource "aws_iam_role" "eb_ec2" {
  name = "${var.project_name}-eb-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for S3 Access
resource "aws_iam_policy" "s3_access" {
  name        = "${var.project_name}-s3-access"
  description = "Policy for S3 bucket access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.app_storage.arn,
          "${aws_s3_bucket.app_storage.arn}/*"
        ]
      }
    ]
  })
}

# Attach S3 Policy to EB Role
resource "aws_iam_role_policy_attachment" "eb_s3" {
  role       = aws_iam_role.eb_ec2.name
  policy_arn = aws_iam_policy.s3_access.arn
}

# IAM Instance Profile for Elastic Beanstalk
resource "aws_iam_instance_profile" "eb_ec2" {
  name = "${var.project_name}-eb-ec2-profile"
  role = aws_iam_role.eb_ec2.name
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/elasticbeanstalk/${var.project_name}-${var.environment}"
  retention_in_days = 30
}

# Outputs
output "rds_endpoint" {
  description = "RDS Primary Endpoint"
  value       = aws_db_instance.primary.endpoint
  sensitive   = false
}

output "rds_replica_endpoint" {
  description = "RDS Replica Endpoint"
  value       = aws_db_instance.replica.endpoint
  sensitive   = false
}

output "redis_endpoint" {
  description = "ElastiCache Redis Endpoint"
  value       = aws_elasticache_replication_group.redis.configuration_endpoint_address
  sensitive   = false
}

output "redis_primary_endpoint" {
  description = "ElastiCache Redis Primary Endpoint"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
  sensitive   = false
}

output "s3_bucket_name" {
  description = "S3 Bucket Name"
  value       = aws_s3_bucket.app_storage.id
}

output "s3_bucket_arn" {
  description = "S3 Bucket ARN"
  value       = aws_s3_bucket.app_storage.arn
}

output "iam_instance_profile" {
  description = "IAM Instance Profile for Elastic Beanstalk"
  value       = aws_iam_instance_profile.eb_ec2.name
}

# Variables file example (terraform.tfvars.example)
# Copy to terraform.tfvars and fill with actual values
#
# project_name = "intranet-proyectos"
# environment  = "production"
# db_username = "admin"
# db_password = "your-secure-password"
# admin_email = "admin@example.com"

