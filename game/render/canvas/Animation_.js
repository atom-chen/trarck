(function  () {
    /**
     * 每帧可以自己定义显示时长
     */
    Animation=yhge.core.Class(Shape, {
        classname:"Animation",
        _enable:true,
        _currentFrame:0,
        _totalFrames:0,//兼容其它语言
        _totalDuration:0,
        _frames:null,
        _elapsed:0,

        initialize: function(props) {
            console.log("init Animation");
            Animation._super_.initialize.apply(this,arguments);
        },

        /**
         * 使用时间间隔，当前时间只取一次就可以
         */
        update: function(delta) {
            if(this._enable){
                this._elapsed+=delta;
                this._currentFrame=this._getIndex();
            }
        },
        /**
         * 折半查找
         */
        _getIndex:function(){
            //this._elasped>0
            var elapsed=this._elapsed % this._totalDuration;
            
            if(elapsed==0) return this._totalFrames-1;
            if(elapsed<=this._durations[0]) return 0;
            
            var min=0,max=this._totalFrames-1,mid=Math.floor(min+max)/2;
            do{
                if(this._durations[mid]>elapsed){
                    max=mid;
                }else if(this._durations[mid]<elapsed){
                    min=mid;
                }else{
                    break;
                }
                mid=Math.floor(min+max)/2;
            }while(max-min>1);
            return mid;
        },
        
        /**
         * 开始动画
         */
        play: function () {
            this._enable=true;
        },

        /**
         * 停止
         */
        stop: function () {
            this._enable=false;
        },

        /**
         * 设置当前帧
         * @param {number} frNumber
         */
        setCurrentFrame: function (frNumber) {
            // if(frNumber>=this._totalFrames){
            // this._currentFrame=this._totalFrames-1;
            // }else if(frNumber<0){
            // this._currentFrame=0;
            // }else{
            // this._currentFrame=frNumber;
            // }
            this._currentFrame=frNumber<0?0:(frNumber>=this._totalFrames?this._totalFrames-1:frNumber);
        },

        getCurrentFrameIndex: function() {
            return this._currentFrame;
        },

        nextFrame: function() {
            this._currentFrame = (this._currentFrame + 1) % this._totalFrames;
            this.stop();
        },

        prevFrame: function() {
            if (this._currentFrame == 0) {
                this._currentFrame = this._totalFrames - 1;
            } else {
                this._currentFrame--;
            }
            this.stop();
        },

        gotoAndPlay: function(frNumber) {
            this.setCurrentFrame(frNumber);
            this.play();
        },

        gotoAndStop: function(frNumber) {
            this.setCurrentFrame(frNumber);
            this.stop();
        },

        addFrame: function(frame,index) {
            if(index==null) {
                this._frames.push(frmae);
            } else {
                this._frames.splice(index,0,frame);
            }
            //this._totalFrames=this._frames.length;
            this._totalFrames++;
            this._totalDuration+=frame._duration;
            this._durations.push(this._totalDuration);
        },

        removeFrame: function(frame) {
            if(typeof frame=="number") {
                if(frame<0 || frame>=this._frames.length) return;
                frame=this._frames.splice(frame,1);
            } else {
                var i=this._frames.indexOf(frame);
                if(i<0) return;
                this._frames.splice(i,1);
            }
            this._totalFrames--;
            this._totalDuration-=frame._duration;
        },

        getFrame: function(index) {
            return index>-1 && index<this._totalFrames? this._frames[index] : null;
        },

        getCureentFrame: function() {
            return this._frames[this._currentFrame];
        }
        
    });
})();