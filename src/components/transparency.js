import React,{Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import { connect } from 'react-redux';
import {decisionMatrix} from '../utils'
import {onModalClose ,onErrorMessage} from '../actions/ModalAction';
import {default as config} from '../config.js';

class ContentTable extends Component{
    constructor({currentICO}){
        super();
        this.state = {
            matrix: {},
            issuesArray:{},
            decision : ""
        };
        this.currentICO = currentICO;
    }
    componentWillMount(){
        const result = decisionMatrix(this.currentICO.matrix);

        this.setState({
            matrix:this.currentICO.matrix,
            issuesArray : result[1] ,
            decision: result[0]
        });
    }
    getRowClassName(questionKey){
        if (typeof this.state.issuesArray[questionKey] !== "undefined")
            return `${this.state.decision.replace(/\s+/g, '-').toLowerCase() + "-row"}`
    }

    getAlertClassName(questionKey){
        if (typeof this.state.issuesArray[questionKey] !== "undefined")
            return `${this.state.decision.replace(/\s+/g, '-').toLowerCase() + "-alert"}`
    }

    render () {
        return (
            <div>
                <Row>
                    <Col md={9}><h1> {this.currentICO.name}</h1></Col>
                    <Col md={3}>
                        <button href="" className={"transparency-button " + this.state.decision.replace(/\s+/g, '-').toLowerCase() + "-status"}>
                            <p>Transparency</p>
                            <strong>  {this.state.decision} <i className="fa fa-arrow-right"/> </strong>
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>

                        <table className="pure-table">
                            <thead>
                            <tr><th>Question</th><th>Answer</th></tr>
                            </thead>
                            <tbody>
                                {Object.keys(config.matrix).map((key,index)=>{
                                    const currentQuestion = this.state.matrix[key];
                                    const mappedQuestionMatrix = config.matrix[key];

                                    return <tr key={index}>
                                        <td className={this.getRowClassName(key)}>
                                            {mappedQuestionMatrix.question}
                                        </td>
                                        <td>
                                            <p className={`alert-error ${this.getAlertClassName(key)}`}>{currentQuestion.comment}</p>
                                            <p>{currentQuestion.answer ===null?"N/A":(currentQuestion.answer===true?"Yes":"No")}</p>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </div>
        )
    };
}

const MessageModal = ({type , message}) => {
    return (
        <div>
            <div>
                <h3>{type}</h3>
                <ul>
                {message.map((item)=><li key={Math.random()}>${item}</li>)}
                </ul>
            </div>
        </div>
    );
};

class TransparencyModal extends Component {
    constructor(){
        super();
    }

    render() {
        const {showModal ,onModalClose , messageType ,currentICO , message } = this.props;
        if (messageType === "SHOW_MODAL_ERROR" || messageType ==="SHOW_MODAL_MESSAGE"){
            return (showModal === true && <ModalContainer onClose={onModalClose}>
                <ModalDialog onClose={onModalClose}>
                    <MessageModal type={messageType} message={message}/>
                </ModalDialog>
            </ModalContainer>)

        } else
        return (showModal === true && Object.keys(currentICO).length > 0 && <ModalContainer onClose={onModalClose}>

            <ModalDialog onClose={onModalClose}>
                <ContentTable currentICO={currentICO} />
            </ModalDialog>
        </ModalContainer>)
    };
}


const mapStateToProps = (state) => {
    return {
        showModal: state.modal.showModal,
        currentICO : state.modal.currentICO,
        messageType:state.modal.messageType,
        message:state.modal.message,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        onModalClose: () => dispatch(onModalClose()),
        onErrorMessage : (message)=>{
            dispatch(onErrorMessage(message));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransparencyModal)