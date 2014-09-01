/**
   把屏幕坐标向正方向移动一个单位
   设置元件left的时候，不需要减去一个x单位值
   但是在捕获鼠标事件的时候，x方向的偏移量要减去一个x单位大小
  */
(function(){
    if(!isometric) isometric={};

    isometric.Util=function (o) {
        this.options=o;
        this._init();
    };
    isometric.Util.prototype={
        _init:function () {
           var o=this.options;
           this.init(this.options);
           
           //地图中原点坐标在屏幕中的位置。
           ////一、在斜45中确定。斜45中的原点坐标默认和屏幕坐标一起，为了实际需要，要对原点坐标进行平移。originCoord就是平移的大小。
           //this.originCoord=o.originCoord||{x:1,y:0};
           //二、在屏幕坐标中设定。
           this.originPosition=o.originPosition||{left:this.xUnit*2,top:0};//{left:350,top:0}//{left:this.xUnit*2,top:0};
        },
        init:function  (o) {
           //this.setColAndRow(o.COL,o.ROW);
           this.setCoordUnit(o.xUnit,o.yUnit,o.zUnit);
        },
        setColAndRow:function (col,row) {
            this._col=col;
            this._row=row;
        },
        setCoordUnit:function(xUnit,yUnit,zUnit){
            this.xUnit=xUnit;
            this.yUnit=yUnit;
            this.zUnit=zUnit||yUnit*2;
        },
        setOriginPosition:function  (op) {
            this.originPosition=op;
        },
        getOriginPosition:function  () {
            return this.originPosition;
        },
        screenToMapCoord:function (x,y){
             return {x:(x+y)/2,y:(y-x)/2};
        },
        positionToMapCoord: function (left,top){
            if(typeof top=="undefined"){
                top=left.top;
                left=left.left;
            }
            left-=this.originPosition.left;
            top-=this.originPosition.top;
            var x=left/this.xUnit,
                 y=top/this.yUnit;
             //x-=1;
             return this.screenToMapCoord(x,y);
        },
        mapToScreenCoord:function (x,y){
            if(typeof y=="undefined"){
                if(x instanceof Array){
                    y=x[1];
                    x=x[0];
                }else{
                    y=x.y;
                    x=x.x;
                }
            }
            return {x:x-y,y:x+y}
        },
        mapToScreenPosition:function (x,y){
            var coord=this.mapToScreenCoord(x,y);
            return {left:coord.x*this.xUnit+this.originPosition.left,top:coord.y*this.yUnit+this.originPosition.top};
        },
        mapToScreenSize:function(l,b,h){
            var s=l+b,
                w=s*this.xUnit,
                h=s*this.yUnit+h*zUnit;
            return {width:w,height:h};
        },
        mapToScreenAnchor:function (l,b,h){
            return {left:b*this.xUnit,top:h*this.zUnit};
        }
    };
})();