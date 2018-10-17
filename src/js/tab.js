import  React from "react";
import  ReactDOM from "react-dom";

class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        pubsub.on('Tab', this);
    }

    triggerFirstClick() {
        this.firsttab.click();
    }

    getData(event) {
        let id = parseInt(event.target.dataset.id) || 1;
        pubsub.emit('Todos', 'excuteAjax', id);
        pubsub.emit('Add', 'recordTabClick', id);
        pubsub.emit('Todos', 'clearSelectId');

        let lis = document.querySelectorAll('.tab li');
        for (let len = lis.length, i = len; i > 0; i--) {
            lis[i-1].classList.remove('active');
        }
        lis[id - 1].classList.add('active');
    }

    render() {
        return (
            <ul className="tab">
                <li ref={ (firsttab) => { this.firsttab = firsttab} }  className="dai active" data-id="1" onClick={ this.getData }>待开发</li>
                <li className="done"  data-id="2" onClick={ this.getData }>开发完成</li>
                <li className="ce"  data-id="3" onClick={ this.getData }>待测试</li>
                <li className="cedone"  data-id="4"  onClick={ this.getData }>测试完成</li>
            </ul>
        );
    }
}

ReactDOM.render(
    <Tab />,
    document.getElementById('tabBox')
)
