import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Button from '@material-ui/core/Button';


const styles = theme => (
    {
        iconoDelete: {
            color: theme.palette.primary.dark
        },
        elementNameText: {
            color: theme.palette.primary.dark,
            fontSize: '1rem'
        },
    })
;

class MyDialogButtonDelete extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            is_open: false,
        });
        this.setStateDialog = this.setStateDialog.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
    }

    setStateDialog(estado) {
        this.setState(estado)
    }

    onClickButton() {
        const {onSelectForDelete} = this.props;
        if (onSelectForDelete) {
            onSelectForDelete();
        }
        this.setState({is_open: true})
    }

    render() {
        const {
            onDelete,
            element_type,
            element_name,
            classes,
            className = 'text-center',
            tamano_icono = 'xs',
            style = {}
        } = this.props;
        return (
            <Fragment>
                <div className={className} style={style}>
                    <IconButton
                        style={{
                            margin: 0,
                            padding: 4,
                        }}
                        onClick={() => this.onClickButton()}
                    >
                        <FontAwesomeIcon
                            className={classes.iconoDelete}
                            icon={'trash'}
                            size={tamano_icono}
                        />
                    </IconButton>
                </div>
                <Dialog
                    open={this.state.is_open}
                >
                    <DialogTitle id="responsive-dialog-title">{`Eliminar ${element_type}`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {` Desea eliminar ${element_type}`} <strong
                            className={classes.elementNameText}>{element_name}?</strong>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => this.setState({is_open: false})}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                this.setState({
                                    is_open: false
                                });
                                onDelete();
                            }}
                        >
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

MyDialogButtonDelete.propTypes = {
    element_type: PropTypes.string,
    element_name: PropTypes.string,
    onDelete: PropTypes.func
};

export default withStyles(styles, {withTheme: true})(MyDialogButtonDelete);