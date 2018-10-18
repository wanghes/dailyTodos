import  React from "react";
import  ReactDOM from "react-dom";
import Todos from './todos';
import FormCon from './add';
import Side from './side';
import Tab from './tab';

ReactDOM.render(
    <div className="container" id="container">
        <div className="left" id="operater">
            <Side />
        </div>
        <div className="content">
            <div className="todos" id="todos">
                <div id="tabBox" className="tab_box">
                    <Tab />
                </div>
                <table className="list" id="todos_con">
                    <Todos />
                </table>     
            </div>
        </div>
        <div className="add_box">
            <div className="addpost" id="addPost">
                <FormCon />
            </div>
        </div>
    </div>,
    document.getElementById('wrap')
);
