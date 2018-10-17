import  React from "react";
import  ReactDOM from "react-dom";


class Side extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: localStorage.getItem('username') || ''
        };
    }

    componentDidMount() {
        pubsub.on('Side', this);
    }

    clickHandle() {
        pubsub.emit('Add', 'showBox');
        pubsub.emit('Add', 'clearContent');
    }

    render() {
        const { username } = this.state;
        return (
            <div>
                <div className="box">
                    <h3>
                        <i className="fa fa-user-circle" aria-hidden="true"></i>
                        <span>{ username }</span>
                    </h3>
                </div>
                <div className="box2">
                    <h4>操作</h4>
                    <div className="inner">
                        <a className="addbtn" href="javascript:;" onClick={ this.clickHandle }>添加todo</a>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Side />,
    document.getElementById('operater')
);
