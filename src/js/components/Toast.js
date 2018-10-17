import  React from "react";
import  ReactDOM from "react-dom";
import PropTypes from 'prop-types';
// 统计notice总数 防止重复
let noticeNumber = 0;

// 生成唯一的id
const getUuid = () => {
    return 'notification-' + new Date().getTime() + '-' + noticeNumber++;
};

function empty() {}

class Notice extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            shouldClose: false, // 是否开启关闭动画
        }
    }
    componentDidMount () {
        if(this.props.duration > 0){
            this.closeTimer = setTimeout(() => {
                this.close();
            }, this.props.duration - 300); // 减掉消失动画300毫秒
        }
    }
    componentWillUnmount () {
        // 当有意外关闭的时候 清掉定时器
        this.clearCloseTimer();
    }
    clearCloseTimer () {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    }
    close () {
        // 关闭的时候 应该先清掉倒数定时器
        // 然后开启过场动画
        // 等待动画结束 执行回调
        this.clearCloseTimer();
        const _this = this;
        _this.setState({shouldClose: true});
        this.timer = setTimeout(() =>{
            if(this.props.onClose){
                this.props.onClose();
            }
            clearTimeout(_this.timer);
        }, 300);
    }
    render () {
        const {shouldClose} = this.state;
        const { prefixCls, type, iconClass, content } = this.props;

        let className = prefixCls;
        if (type === 'info') {
            className = `${prefixCls} info`;
        } else if(type === 'success') {
            className = `${prefixCls} success`;
        } else if(type === 'warning') {
            className = `${prefixCls} warning`;
        } else if(type === 'error') {
            className = `${prefixCls} error`;
        } 


        if (shouldClose) {
            className = `${className} leave`;
        }

        return (
            <div
                className={ className }
            >
                {iconClass ? <div className={`${prefixCls}-icon`}><span className={ `fa ${iconClass}` } /></div> : null}
                <div className={`${prefixCls}-content`}>{content}</div>
            </div>
        )
    }
}

Notice.propTypes = {
    duration: PropTypes.number.isRequired, // Notice显示时间
    prefixCls: PropTypes.string, // 前缀class
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']), // notice类型
    iconClass: PropTypes.string, // icon的class
    content: PropTypes.any, // Notice显示的内容
    onClose: PropTypes.func // 显示结束回调
};

Notice.defaultProps = {
    prefixCls: 'notice',
    duration: 3000,
    onClose: empty
};


class Notification extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            notices: [], // 存储当前有的notices
            hasMask: true, // 是否显示蒙版
        }
    }
    add (notice) {
        // 添加notice
        // 创造一个不重复的key
        const {notices} = this.state;
        const key = notice.key ? notice.key : notice.key = getUuid();
        const mask = notice.mask ? notice.mask : false;
        const temp = notices.filter((item) => item.key === key).length;

        if(!temp){
            // 不存在重复的 添加
            notices.push(notice);
            this.setState({
                notices: notices,
                hasMask: mask
            });
        }
    }
    remove (key) {
        // 根据key删除对应
        this.setState(previousState => ({notices: previousState.notices.filter(notice => notice.key !== key)}));
    }
    getNoticeDOM () {
        const _this = this;
        const {notices} = this.state;
        const result = [];

        notices.map((notice) => {
            // 每个Notice onClose的时候 删除掉notices中对应key的notice
            const closeCallback = () => {
                _this.remove(notice.key);
                // 如果有用户传入的onClose 执行
                if(notice.onClose) notice.onClose();
            };

            result.push(
                <Notice
                    key={notice.key} {...notice}
                    onClose={closeCallback}
                />
            );
        });

        return result;
    }
    getMaskDOM () {
        const {notices, hasMask} = this.state;
        // notices为空的时候 不显示蒙版
        // 始终只有一个蒙版
        if(notices.length > 0 && hasMask === true) return <div className="zby-mask" />;
    }
    render () {
        const {prefixCls} = this.props;
        const noticesDOM = this.getNoticeDOM();
        const maskDOM = this.getMaskDOM();

        return (
            <div className={prefixCls}>
                {maskDOM}
                <div className={`${prefixCls}-box`}>
                    {noticesDOM}
                </div>
            </div>
        )
    }
}


// Notification增加一个重写方法
// 该方法方便Notification组件动态添加到页面中和重写
Notification.reWrite = function (properties) {
    const { ...props } = properties || {};

    let div;

    div = document.createElement('div');
    document.body.appendChild(div);

    const notification = ReactDOM.render(<Notification {...props} />, div);

    return {
        notice(noticeProps) {
            notification.add(noticeProps);
        },
        removeNotice(key) {
            notification.remove(key);
        },
        destroy() {
            ReactDOM.unmountComponentAtNode(div);
            document.body.removeChild(div);
        },
        component: notification
    }
};

Notification.propTypes = {
    prefixCls: PropTypes.string, // 组件class前缀
};

Notification.defaultProps = {
    prefixCls: 'notification',
};



// Toast组件比较特殊
// 因为<Toast />不会被直接渲染在DOM中
// 而是动态插入页面中
// Toast组件核心就是通过Notification暴露的重写方法 动态改变Notification
let newNotification;

// 获得一个Notification
const getNewNotification = () => {
    // 单例 保持页面始终只有一个Notification
    if (!newNotification) {
        newNotification = Notification.reWrite();
    }

    return newNotification;
};

// notice方法实际上就是集合参数 完成对Notification的改变
const notice = (type, content, mask = false, iconClass, onClose, duration) => {
    let notificationInstance = getNewNotification();

    notificationInstance.notice({
        duration,
        type,
        mask,
        iconClass,
        content,
        onClose: () => {
            if (onClose) onClose();
        },
    });
};


const Toast = {
    // 无动画
    show: (content, mask, iconClass, onClose, duration) => (notice(undefined, content, mask, iconClass, onClose, duration)),
    // 翻转效果
    info: (content, mask, iconClass, onClose, duration) => (notice('info', content, mask, iconClass, onClose, duration)),
    // 缩放效果
    success: (content, mask, iconClass, onClose, duration) => (notice('success', content, mask, iconClass, onClose, duration)),
    // 从下方滑入
    warning: (content, mask, iconClass, onClose, duration) => (notice('warning', content, mask, iconClass, onClose, duration)),
    // 抖动
    error: (content, mask, iconClass, onClose, duration) => (notice('error', content, mask, iconClass, onClose, duration)),
    // loading
    loading: (content) => (notice(undefined, content || '加载中...', true, 'fa-circle-o-notch fa-spin', undefined, 0)),
    // 销毁
    hide() {
        if (newNotification) {
            newNotification.destroy();
            newNotification = null;
        }
    },
}


export default Toast;