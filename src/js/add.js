import  React from "react";
import  ReactDOM from "react-dom";

import Toast from "./components/Toast";

class FormCon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            editStatus: false,
            id: null,
            tab: 1
        };
        this.submitHandle = this.submitHandle.bind(this);
        this.submitEditHandle = this.submitEditHandle.bind(this);
        this.changeContent = this.changeContent.bind(this);
    }

    componentDidMount() {
        pubsub.on('Add', this);
    }

    recordTabClick(id) {
        this.setState({
            tab: id
        });
        this.showBox();
    }

    submitHandle() {
        const content = this.state.content;
        if (!content) {
            Toast.error('请填写内容', 2000);
            return;
        }

        Ajax('post', '/addTodo', {
            content
        }, (data) => {
            data = JSON.parse(data);
            if (data.code == 1) {
                pubsub.emit('Tab', 'triggerFirstClick');
                this.setState({
                    content: ''
                });
                Toast.success('添加完成', 2000);
                document.querySelector('#todos').scrollTop  = 0;
            }
        });
    }

    submitEditHandle(id) {
        const content = this.state.content;

        if (!content) {
            Toast.error('请填写内容', 2000);
            return;
        }

        Ajax('post', `/editTodo/${id}`, {
            content
        }, (data) => {
            data = JSON.parse(data);
            if (data.code == 1) {
                Toast.success('修改完成', 2000);
                pubsub.emit('Todos', 'excuteAjax');
            }
        });
    }

    changeContent(event) {
        let value = event.target.value;
        this.setState({
            content: value
        })
    }

    clearContent() {
        this.setState({
            content: ''
        })
    }
    showBox(id) {
        const { tab } = this.state;
        if (id) {
            this.setState({
                editStatus: true
            });

            Ajax('get', `/todo/${id}`, {} , (data) => {
                data = JSON.parse(data);
                if (data.code == 1) {
                    this.setState({
                        content: data.data.content,
                        id
                    });
                    pubsub.emit('Todos', 'excuteAjax', tab);
                }
            });
            return;
        }
        this.setState({
            editStatus: false,
            content: ''
        });
    }

    render() {
        const { editStatus, content, id } = this.state;

        const EditBox = () => {
             return (
                <table>
                    <tbody>
                        <tr>
                            <td><label>todo内容</label></td>
                            <td>
                                <textarea  className="con" 
                                    value={ content } 
                                    onChange={ this.changeContent } 
                                    placeholder="请填写todo">
                                </textarea>
                            </td>
                        </tr>
                        <tr colSpan="2">
                            <td className="sub">
                                <a onClick={ () => this.submitEditHandle(id) } className="submit">保存修改</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )
        }

        const AddBox = () => {
            return (
                <table>
                    <tbody>
                        <tr>
                            <td><label>todo内容</label></td>
                            <td>
                                <textarea className="con" 
                                    value={ content } 
                                    onChange={ this.changeContent } 
                                    placeholder="请填写todo">
                                </textarea>
                            </td>
                        </tr>
                        <tr colSpan="2">
                            <td className="sub">
                                <a onClick={ this.submitHandle } className="submit">提交todo</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )
        }

        if (editStatus) {
            return EditBox();
        } else {
            return AddBox()
        }

    }
}

ReactDOM.render(
    <FormCon />,
    document.getElementById('addPost')
);
