function Ajax(type, url, data, success, failed){
    let host = '';
    if (location.host.indexOf('localhost') > -1 || location.host.indexOf('localhost') > -1 || location.host.indexOf('10.201.0.241') > -1) {
        host = "http://todo.mousecloud.cn"
    } else {
        host = "http://todo.mousecloud.cn"
    }

    // 创建ajax对象
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.timeout = 5000;

    var token = localStorage.getItem('token');

    var type = type.toUpperCase();
    // 用于清除缓存
    var random = Math.random();

    if(typeof data == 'object'){
        var str = '';
        for(var key in data){
            str += key+'='+data[key]+'&';
        }
        data = str.replace(/&$/, '');
    }

    if(type == 'GET'){
        if(data){
            xhr.open('GET', host+url + '?' + data, true);
        } else {
            xhr.open('GET', host+url + '?t=' + random, true);
        }
        if (token) {
            xhr.setRequestHeader("token", token);
        } 

        xhr.send();

    } else if(type == 'POST'){
        xhr.open('POST', host+url, true);
        // xhr.withCredentials = true;
        if (token) {
            xhr.setRequestHeader("token", token);
        } 
        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhr.send(data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                success(xhr.responseText);
            } else {
                if(failed){
                    failed(xhr.status);
                } else {
                    if (xhr.status == 401) {
                        localStorage.clear();
                        location.href = 'login.html';
                    }
                }
            }
        }
    }
}


var pubsub = {
    events: {},
    on: function(name, obj) {
        this.events[name] = obj;
    },
    off: function(name) {
        if (!(name)) {
            this.events = {};
        }
        var obj = this.events[name];
        if (obj) {
            delete this.events[name];
        }
    },
    emit: function(name, callbackName ,data) {
        var obj = this.events[name];
        if (obj) {
            obj[callbackName](data);
        }
    }
}

