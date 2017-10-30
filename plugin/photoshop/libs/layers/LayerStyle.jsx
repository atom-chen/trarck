//require defines/Terminology
//require Log

var LayerStyle;
(function(){
    var xc=true;
    
    LayerStyle=function(layer){
        this.layer=layer;
        
        this.style = {};
        this.style.dropShadow = [];
        this.style.innerShadow = [];
        this.style.outerGlow = [];
        this.style.innerGlow = [];
        this.style.stroke = [];
        this.style.solidFill = [];
        this.style.gradientFill = [];
        this.style.opacity = [];
        this.style.borderRadius = [];
        this.style.dimensions = [];
        this.style.font = [];
        
        this.na = [];
        this.Z = [];
        this.ba = [];
    };     
    
    LayerStyle.prototype={
        initialize:function(){
            this.active();
            var layerDescriptor=ActionUtils.getActiveLayerDescriptor();
            this.layerDescriptor=layerDescriptor;
            
            this.descriptorData=ActionUtils.getDescriptorData(layerDescriptor);
            this.resolution=72;
            
            //layerSection
            this.layerSection=this.descriptorData.layerSection;
            if('layerSectionStart' == this.layerSection || 'layerSectionEnd' == this.layerSection){
                throw 'LayerGroupSelected';
            }
            if('layerSectionContent' != this.layerSection){
                throw 'Unexpected layer type: ' + this.layerSection;
            }
             
            //read id
            this.layerId=yh.checkType(layerDescriptor.getInteger(charIDToTypeID('LyrI')),'number').toString();
            this.name=yh.checkType(ActionUtils.getPSObjectPropertyChain(layerDescriptor,'name'),'string');
            this.checkMode(this, '', 'layer');
            
            this.la=false;
            this.kind=this.layer.kind.toString();
            /isText
            this.isText = 'LayerKind.TEXT' === this.kind;
            this.opacity = yh.checkType(this.readActiveValue('opacity') / 255, 'number');
            this.fillOpacity = yh.checkType(this.readActiveValue('fillOpacity') / 255, 'number');
            this.globalAngle = yh.checkType(this.readActiveValue('globalAngle'), 'number');
            1 > this.opacity && this.style.opacity.push({
                value: this.opacity,
                name: 'layer alpha'
            });
            if (this.isText && xc) {
                var color, textItem = this.layer.textItem;
                textItem.contents || throw 'NoContentsTextLayer';
                var face = textItem.font,
                    size = textItem && textItem.size || 20,
                    family, font, underline = UnderlineType.UNDERLINEOFF;
                try {
                    underline = textItem && textItem.underline || UnderlineType.UNDERLINEOFF;
                } catch (ex) {}
                var k = 'normal',
                    style = 'normal';
                try {
                    font = app.fonts[face];
                } catch (t) {}
                var fontName,fontFamily,fontStyle;
                if(font){
                    fontName = font.name, fontFamily = font.family, fontStyle = font.style
                }else{
                    console.log('Font ' + fontName + ' is not available on your computer and because of that, we cannot get it\'s family and style :(.');
                    fontName = fontFamily = fontStyle = face;
                }

                var check= [];
                fontStyle.match(/bold/i) && (fontWeight = 'bold', check.push('font weight (' + fontWeight + ')'));
                fontStyle.match(/italic/i) && (style = 'italic', check.push('font style (' + style + ')'));
                
                try {
                    color = new Corlor(this.layer.textItem.color.rgb.red, this.layer.textItem.color.rgb.green, this.layer.textItem.color.rgb.blue, 1);
                } catch (ex) {
                    color = new Corlor(0, 0, 0, 1);
                }
                var fontData = {
                    color: {
                        color: color
                    },
                    name: fontName || null,
                    family: fontFamily || null,
                    weight: fontWeight || null,
                    style: style || null,
                    size: size || null,
                    underline: (underline ? (underline == UnderlineType.UNDERLINEOFF ? false : true) : null)
                };
                this.style.solidFill.push({
                    value: fontData.color,
                    name: 'text color'
                });
                this.style.font.push({
                    value: fontData,
                    name: 'font'
                });
                
            } else if('LayerKind.SOLIDFILL' == this.kind && 0.01 < this.fillOpacity){ 
                this.style.solidFill.push({
                    value: this.getAdjustment(),
                    name: 'layer fill content'
                });
            }
            //'layerFxEnabled'
            if (this.readActiveValue('layerFXVisible', undefined, true)) {
                //'solidFillFx';
                var color = null;
                if(this.isLayerEffectEnable('solidFill') ){ 
                    this.checkMode( 'solidFill', 'solid fill');
                    var solidFill = {
                        color: this.getLayerEffectObjectProperty('solidFill.color', 'color')
                    };
                    var opacity = this.getLayerEffectObjectProperty('solidFill.opacity') / 100;
                    solidFill.color.a = opacity;
                    color = solidFill.color;
                    this.style.solidFill.push({
                        value: solidFill,
                        name: 'color overlay'
                    });
                }
                //'gradientFillFx'
                if(this.isLayerEffectEnable('gradientFill') ){ 
                    this.checkMode( 'gradientFill', 'gradient fill');
                    var gradientFill = this.getLayerEffectObjectProperty('gradientFill');
                    var gradientFillData = this.getGradientFillData(gradientFill, false, color);
                    var name = 'gradient overlay';
                    if(color){ 
                        name = this.style.solidFill[this.style.solidFill.length-1].name + ' + ' + name;
                        this.style.solidFill.pop();                        
                    }
                    this.style.gradientFill.push({
                        value: gradientFillData,
                        name: name
                    });
                }
    I.f('frameFX');
    var i;
    this.isLayerEffectEnable('frameFX') && (this.checkMode( 'frameFX', 'stroke'), ('solidColor' == this.getLayerEffectObjectProperty('frameFX.paintType') ? i = this.getLayerEffectObjectProperty('frameFX.color', 'color') : (this.Z.push('stroke'), i = Ma(Ac(this, this.getLayerEffectObjectProperty('frameFX')).gradient))), i = {
      size: parseFloat(this.getLayerEffectObjectProperty('frameFX.size')),
      color: i,
      style: this.getLayerEffectObjectProperty('frameFX.style')
    }, c = this.getLayerEffectObjectProperty('frameFX.opacity') / 100, i.color.c = c, this.style.stroke.push({
      value: i,
      a: 'stroke'
    }));
    I.f('dropShadow');
    this.isLayerEffectEnable('dropShadow') && (this.checkMode( 'dropShadow', 'drop shadow'), c = Bc(this, 'dropShadow', 'drop shadow', m), this.style.dropShadow.push({
      value: c,
      a: 'drop shadow'
    }));
    I.f('innerShadow');
    this.isLayerEffectEnable('innerShadow') && this.style.innerShadow.push({
      value: Cc(this),
      a: 'inner shadow'
    });
    I.f('innerGlow');
    this.isLayerEffectEnable('innerGlow') && ((this.getLayerEffectObjectProperty('innerGlow.color', 'color') || Ac(this, this.getLayerEffectObjectProperty('innerGlow')) ? this.style.innerGlow.push({
      value: Dc(this),
      a: 'inner glow'
    }) : this.ba.push('inner glow')));
    I.f('outerGlow');
    this.isLayerEffectEnable('outerGlow') && ((this.getLayerEffectObjectProperty('outerGlow.color', 'color') || Ac(this, this.getLayerEffectObjectProperty('outerGlow')) ? this.style.outerGlow.push({
      value: Ec(this),
      a: 'outer glow'
    }) : this.ba.push('outer glow')));
    if (!this.isText && 'undefined' != typeof i && ('insetFrame' == i.style || 'centeredFrame' == i.style)) {
      var w = i.size;
      i = function(a) {
        var b = w;
        if (a.value.g > 0) {
          var c = a.value.g;
          a.value.g = Math.max(a.value.g - b, 0);
          b = b - (c - a.value.g);
        }
        if (b > 0 && a.value.distance > 0) a.value.distance = Math.max(a.value.distance - b, 0);
        return a;
      };
      this.style.innerShadow = this.style.innerShadow.map(i);
      this.style.innerGlow = this.style.innerGlow.map(i);
    }
  }
  I.f('gradientFill');
  'LayerKind.GRADIENTFILL' == this.ta && 0.01 < this.fillOpacity && this.style.gradientFill.push({
    value: Fc(this),
    a: 'layer fill content'
  });
  I.f('borderRadius');
  i = this.Ra;
  ((c = Gc()) ? i = c : ((i = i.name.match(/(\d+)px/i)) && i[1] ? (i = parseFloat(i[1]), i = {
    source: 'radius from layer name',
    X: new ya(new wa(i), new wa(i), new wa(i), new wa(i)),
    bounds: o
  }) : i = {
    X: o,
    bounds: o
  }));
  i.X && this.style.borderRadius.push({
    value: i.X,
    a: 'border radius'
  });
  Hc && (I.f('bounds'), (i.bounds ? this.style.dimensions.push({
    value: {
      top: i.bounds.w,
      left: i.bounds.v,
      width: i.bounds.z - i.bounds.v,
      height: i.bounds.A - i.bounds.w
    },
    a: 'dimensions'
  }) : this.style.dimensions.push({
    value: Ic(),
    a: 'dimensions'
  })));
  I.f('effectsWeCannotRender');
  i = [];
  this.isLayerEffectEnable('bevelEmboss') && i.push('bevel & emboss');
  this.isLayerEffectEnable('chromeFX') && i.push('satin');
  this.isLayerEffectEnable('patternFill') && i.push('pattern overlay');
  i.length && (I.k('Note: CSS Hat currently cannot render ' + i.m() + ', as it is hard to express in CSS.'), this.la = m);
  this.na.length && (I.k('Blending modes are used in ' + this.na.m() + ', but they are impossible to realistically transfer to CSS.'), this.la = m);
  this.Z.length && (I.k(this.Z.m().ea() + ' ' + ((1 < this.Z.length ? 'have' : 'has')) + ' a gradient fill type, but there is no way to express that in CSS, writing the average color instead.'), this.la = m);
  this.ba.length && (I.k(this.ba.m().ea() + ' ' + ((1 < this.ba.length ? 'have' : 'has')) + ' a noise gradient fill type, but there is no way to express that in CSS.'), this.la = m);
  I.ka();
        },
        active:function(){
            if(this.layer.parent.activeLayer!=this.layer){
                this.layer.parent.activeLayer=this.layer;
            }
        },
         
        readActiveValue:function(path, type, defaultValue){
            if(!this.layerDescriptor){
                this.layerDescriptor=ActionUtils.getActiveLayerDescriptor();
            }
            
            ActionUtils.getPSObjectPropertyChain(this.layerDescriptor,path, type, defaultValue);
        },
        getLayerEffectObjectProperty:function(key, type) {
            return this.readActiveValue('layerEffects.' + key, type);
        },
        isLayerEffectEnable:function(effect) {
            var path = 'layerEffects.' + effect + '.enabled',
            return this.readActiveValue(path, undefined, true) && this.readActiveValue('layerEffects.' + effect + '.enabled');
        },
        checkMode:function(key,name){
           'normal' != this.readActiveValue(((key ? 'layerEffects.' + key + '.' : '')) + 'mode') && this.na.push(name);
        },
        getAdjustment:function() {
            var ret = {
                color: readActiveValue('adjustment[0].color', 'color')
            };
            ret.color.a = this.fillOpacity;
            return ret;
        },
        
        getGradientFillData:function(gradientFill,useLayerFillOpacity,color){
            
        }
        
    };
})();