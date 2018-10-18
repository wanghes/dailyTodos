import  React from "react";
import  { ContextMenu, MenuItem } from './components/context-menu'

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }
    handleClick(e, data, el) {
        e.stopPropagation();
        pubsub.emit('Todos', 'deleteData', data.id);
    }
    handleEditClick(e, data, el) {
        e.stopPropagation();
        pubsub.emit('Todos', 'showDetail', data.id);
    }
    waitDevelopHandle(e, data, el) {
        e.stopPropagation();
        pubsub.emit('Todos', 'waitDevelopHandle', data.id);
        pubsub.emit('Add', 'showBox');
    }
    developDoneHandle(e, data, el) {
        e.stopPropagation();
        pubsub.emit('Todos', 'developDoneHandle', data.id);
        pubsub.emit('Add', 'showBox');
    }
    waitTestHandle(e, data, el) {
        e.stopPropagation();
        pubsub.emit('Todos', 'waitTestHandle', data.id);
        pubsub.emit('Add', 'showBox');
    }
    TestDoneHandle(e, data, el) {
        e.stopPropagation();
        pubsub.emit('Todos', 'TestDoneHandle', data.id);
        pubsub.emit('Add', 'showBox');
    }
    render() {
        const { id } = this.props;
        return (
            <ContextMenu>
                <MenuItem onClick={ this.waitDevelopHandle } data={{ id }}>待开发</MenuItem>
                <MenuItem onClick={ this.developDoneHandle } data={{ id }}>开发完成</MenuItem>
                <MenuItem onClick={ this.waitTestHandle } data={{ id }}>待测试</MenuItem>
                <MenuItem onClick={ this.TestDoneHandle } data={{ id }}>测试完成</MenuItem>
                <MenuItem onClick={ this.handleEditClick } data={{ id }}>修改</MenuItem>
                <MenuItem onClick={ this.handleClick } data={{ id }}>删除</MenuItem>
            </ContextMenu>
        );
    }
};


class TrsTodos extends React.Component {
     constructor(props) {
        super(props)
        this.state = {
            data: []
        };
    }

    render() {
        const { data, clickHandle, showDetail, selectId } = this.props;
        return (
            <tbody>
                {
                    data.map((item) => {
                        const activeName = selectId == item.id ? 'active' : '';
                        return (
                            <tr className={activeName} key={item.id} onClick={ () => showDetail(item.id) }>
                                <td>
                                    <span>{ item.content }</span>
                                    <span className="time">{ item.updatetime }</span>
                                     <span>
                                        {/* <a  href="javascript:;"><i onClick={ clickHandle } data-id={ item.id } className="fa fa-window-close"></i></a>*/}
                                    </span>
                                    <Menu id={ item.id } />
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        )
    }
}

class Todos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectId: null,
            tab: 1
        };
        this.clickHandle = this.clickHandle.bind(this);
        this.showDetail = this.showDetail.bind(this);
    }
    excuteAjax(type = 1) {//待开发
        Ajax('post', '/todos', {
            type: type
        }, (data) => {
            data = JSON.parse(data);
            if (data.code == 1) {
                this.setState({
                    data: data.data,
                    tab: type
                })
            }
        });
    }

    componentDidMount() {
        pubsub.on('Todos', this);
        this.excuteAjax();
    }

    showDetail(id) {
        pubsub.emit('Add', 'showBox', id);
        this.setState({
            selectId: id
        })
    }

    waitDevelopHandle(id) {
        const { tab } = this.state
        Ajax('post', `/editTodoStatus/${id}`, {
            type: 1
        }, (data) => {
            data = JSON.parse(data);
            if (data.code == 1) {
                pubsub.emit('Todos', 'excuteAjax', tab);
            }
        });
    }


    developDoneHandle(id) {
        const { tab } = this.state
        Ajax('post', `/editTodoStatus/${id}`, {
            type: 2
        }, (data) => {
            data = JSON.parse(data);
            if (data.code == 1) {
                pubsub.emit('Todos', 'excuteAjax', tab);
            }
        });
    }

    waitTestHandle(id) {
        const { tab } = this.state
        Ajax('post', `/editTodoStatus/${id}`, {
            type: 3
        }, (data) => {
            data = JSON.parse(data);
            if (data.code == 1) {
                pubsub.emit('Todos', 'excuteAjax', tab);
            }
        });
    }

    clearSelectId() {
         this.setState({
            selectId: null
        });
    }

    TestDoneHandle(id) {
        const { tab } = this.state
        Ajax('post', `/editTodoStatus/${id}`, {
            type: 4
        }, (data) => {
            data = JSON.parse(data);
            if (data.code == 1) {
                pubsub.emit('Todos', 'excuteAjax', tab);
            }
        });
    }

    deleteData(id) {
        const { selectId } = this.state;
        let { data } = this.state;
         Ajax('get', `/todos/delete/${id}`, {}, (result) => {
            result = JSON.parse(result);
            if (result.code == 1) {
                const newData = data.filter((item) => {
                    return (item.id != id);
                });

                this.setState({
                    data:newData
                });
                pubsub.emit('Add', 'showBox');
            }
        });
    }

    clickHandle(event) {
        event.stopPropagation();
        const id = event.target.dataset.id;
        this.deleteData(id);
    }
    render() {
        const { data, selectId } = this.state;
        return (
            <TrsTodos data={ data } selectId={selectId} clickHandle={ this.clickHandle } showDetail={ this.showDetail } />
        )
    }
}

export default Todos;
