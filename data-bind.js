/**
 * 数据绑定插件
 * @author: chenfeng<feng.chen@yoho.cn>
 * @date: 2016/09/27
 */
var $ = require('yoho-jquery');

function DataBind(elem, scope, varName) {
    this.varName = varName;
    this.elem = elem;
    this.scope = scope;
    this.extend(scope);
}
DataBind.prototype.extend = function(scope) {
    if (scope.parentScope) {
        this.extend(scope.parentScope);
    }
    $.extend(this, scope);
}
DataBind.prototype.elName = '.data-bind'
DataBind.prototype.bindDirects = ['if', 'for', 'bind', 'model', 'class'];
DataBind.prototype.render = function() {
    var that = this;
    var directs = this.elemDirects();
    (function resolveExpression(i, canNext) {
        if (i < directs.length && canNext) {
            var direct = directs[i];
            that.elem.removeClass('data-bind')
            direct.factory.apply(that, [direct.expression, function() {
                resolveExpression(++i, true);
            }])
        }
    }(0, true));
     while(this.elem.find('.data-bind').length){
        invoke(this.elem.find('.data-bind').first(), this.scope);
    }
}
DataBind.prototype.elemDirects = function() {
    var that = this;
    var directs = [];
    $(this.bindDirects).each(function(i, val) {
        if ($(that.elem).data(val)) {
            directs.push({
                expression: $(that.elem).data(val),
                factory: that['factory' + val[0].toUpperCase() + val.substr(1)]
            })
        }
    });
    return directs;
}
DataBind.prototype.factoryIf = function(expression, next, vari) {
    console.log(expression)
    var db = this;
    var that = this;
    if (this.varName) {
        console.log('var '+this.varName+' = this')
        eval('var '+this.varName+' = this');
    }

    that.elem.removeAttr('data-if');
    if (!eval(expression)) {
        this.elem.remove();
    } else {
       
        next();
    }
}
DataBind.prototype.factoryFor = function(expression, next) {
    var db = this;
    var that = this;
    console.log('for');
    that.elem.removeAttr('data-for');
    var reg = /(\b[\w\.\[\]]+\b) as (\b[\w]+\b)/;
    var match = reg.exec(expression);
    console.log(eval(match[1]))
    var list = eval(match[1]);
    $(list).each(function(i, val) {
        val.parentScope = that.scope;
        var ele = that.elem.clone();
        console.log(ele)
        invoke(ele, val, match[2]);
    });
}
DataBind.prototype.factoryBind = function(expression, next) {
    var db = this;
    var that = this;
    if (this.varName) {
        console.log('var '+this.varName+' = this')
        eval('var '+this.varName+' = this');
    }
    console.log(this.elem)
    console.log('bind as')
    that.elem.removeAttr('data-bind');
    var val = eval(expression);
    this.elem.text(val);
    next();
}
DataBind.prototype.factoryModel = function(expression, next) {
    var that = this;
    if (this.varName) {
        console.log('var '+this.varName+' = this')
        eval('var '+this.varName+' = this');
    }
    console.log('model')
    that.elem.removeAttr('data-model');
    var val = eval(expression);
    this.elem.val(val);
}
DataBind.prototype.factoryClass = function(expression, next) {
    var that = this;
    var db = this;
    console.log('class')
    that.elem.removeAttr('data-class');
    if (this.varName) {
        eval('var '+this.varName+' = this');
        console.log('var '+this.varName+' = this')
    }
    console.log('class')
    console.log(expression)
    console.log('112')
    var classData = eval('('+expression+')');
    this.elem.css(classData);
    console.log('12')
}

function invoke(elem, scope, varName) {
    new DataBind(elem, scope, varName || 'db').render();
}
function DataBindElem(data, el) {
    $.extend(this, data);
    this.el = el;
    this.resolve = false;
}
module.exports = invoke;
