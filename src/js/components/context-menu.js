import  React from "react";


class MenuItem extends  React.Component{
    handleClick=(event) => {
        event.preventDefault();
        if( this.props.onClick != null ) {
            this.props.onClick(event, this.props.data, this.props.src);
        }
    };

    render() {
        return (
            <div className={"react-context-menu-item"}
                 style={{visibility:this.props.disabled?"hidden":"visiable",
                 display:this.props.disabled?"none":"block"}}
                 onClick={this.handleClick} >
                <a href="#" className={"react-context-menu-link"}>
                    {this.props.children}
                </a>
            </div>
        );
    }
};


class SubMenu extends  React.Component{
    static menuStyles = {
        position: "relative",
        zIndex: "auto"
    }
    constructor(prpos){
        super(prpos);
        this.state={};
        this.state.position={};
        this.state.visible=false;
    };

    hideContextMenu=(e) =>{
        //  e.preventDefault();
        this.setState({visible:false});
    };
    handleClickSubmenu=(e) => {
        e.preventDefault();
        e.stopPropagation();
        var pp =this.getMenuPosition();
        this.setState({visible:!this.state.visible, top:pp.top,left:pp.left,bottom:pp.bottom,right:pp.right});

    };
    handleMouseEnter=(e) =>{
    // set Timer to hidden,if
        clearTimeout(this.state.timer);
        var pp =this.getMenuPosition();
        this.setState({visible:true, top:pp.top,left:pp.left,bottom:pp.bottom,right:pp.right});
    };
    handleMouseLeave=() =>{
       // this.state.visible=false;
       // set Timer to hidden,if
        this.state.timer=setTimeout(() =>{
            this.setState({visible:false});
        },500);
    };
    getMenuPosition=() =>{
        let { innerWidth, innerHeight } = window;

        if(this.menu==null) return {};
        let  rect = this.menu.getBoundingClientRect();
        let style = {};
        if (rect.bottom > innerHeight) {
            style.bottom = 0;
        } else {
            style.top = 0;
        }
        if (rect.right > innerWidth) {
            style.right = "100%";
        } else if(innerWidth<400) {
            style.left =0;
            style.top="100%";
        }else{
            style.left = "100%";
        }
        return style;
    };
    render=() =>{

        let menus = this.props.children.map( (o, i) =>{
              if( (o.type== SubMenu)  ||(o.type==MenuItem )  )
                    return React.cloneElement(o, {  key: i,src:this.props.src  })
        });
        let other= this.props.children.map( (o, i) =>{
            if((o.type!= SubMenu)  && (o.type!=MenuItem))
                return React.cloneElement(o, {   key: i,src:this.props.src })
        });

        const substyle = {
        //    display: this.state.visible ? "block" : "none",
            visibility:this.state.visible?"visible":"hidden",
            position: "absolute",
            top:this.state.top,
            left:this.state.left,
            bottom:this.state.bottom,
            right:this.state.right

         };
        return (
            <div  className={ "react-context-menu-item submenu"}
                  style={SubMenu.menuStyles}
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.handleMouseLeave}
                  onClick={this.hideContextMenu}>

                <a href="#" className={"react-context-menu-link"} onClick={this.handleClickSubmenu}>
                    {other}{this.props.title}
                </a>
                    <nav  ref={(c) =>this.menu=c}style={substyle} className="react-context-menu">
                        {menus}
                    </nav>
            </div>
        );
    }

};

class ContextMenu extends  React.Component{
    constructor(props) {
        super(props);
        this.state={
            visiable:false
        };
    }

    componentDidMount() {
        pubsub.on('ContextMenu', this);
        this.dom.parentNode.addEventListener("contextmenu",(e) =>{
             this.showContextMenu(e);
        });
        document.addEventListener("click", (e) =>{
            this.hideContextMenu(e);
        });
    };

    hideContextMenu=(e) =>{
        const menus = document.querySelectorAll('.react-context-menu');
        for (let i = 0; i < menus.length; i++) {
            menus[i].style.display = 'none';
        }
    };
    showContextMenu=(e) =>{
        const menus = document.querySelectorAll('.react-context-menu');
        for (let i = 0; i < menus.length; i++) {
            menus[i].style.display = 'none';
            this.setState({
                visiable:false
            });
        }
        e.preventDefault();
        this.state.menuStyles = this.getMousePosition(e);
        this.state.src = e.target;
        this.setState({
            visiable:true
        });
    };
    getMousePosition=(event) => {
        const x = event.clientX || (event.touches && event.touches[0].pageX),
            y = event.clientY || (event.touches && event.touches[0].pageY);
        let scrollX = document.documentElement.scrollTop,
            scrollY = document.documentElement.scrollLeft,
            { innerWidth, innerHeight } = window,
            rect = this.dom.getBoundingClientRect(),
            menuStyles = {
                top: y + scrollY,
                left: x + scrollX
            };
        if (y + rect.height > innerHeight) {
            menuStyles.top -= rect.height;
        }
        if (x + rect.width > innerWidth) {
            menuStyles.left -= rect.width;
        }
        if (menuStyles.top < 0) {
            menuStyles.top = (rect.height < innerHeight) ? (innerHeight - rect.height) / 2 : 0;
        }
        if (menuStyles.left < 0) {
            menuStyles.left = (rect.width < innerWidth) ? (innerWidth - rect.width) / 2 : 0;
        }
        menuStyles.position="fixed";
        return menuStyles;

    };
    render=() => {
        let menuStyles={
            ...this.state.menuStyles,
            display: this.state.visiable ? "block" : "none",
            position:"fixed"
        };

        let hackedChildren={};
        if(this.props.children.type == MenuItem || this.props.children.type == SubMenu ) {
              hackedChildren = React.cloneElement(this.props.children, { src: this.state.src });
        } else {
            hackedChildren= this.props.children.map( (o, i) =>{
                return React.cloneElement(o, { key:i,  src: this.state.src })
            });
        }

        return (
            <nav ref={ (c) =>this.dom=c } style={menuStyles}  id={this.props.id}  onClick={this.hideContextMenu}
                  className="react-context-menu">
                {hackedChildren}
            </nav>
        );
    }
};


export {
    MenuItem,
    SubMenu,
    ContextMenu
}