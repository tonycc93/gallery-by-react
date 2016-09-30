require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
//import ReactDOM from 'react-dom';

//let yeomanImage = require('../images/yeoman.png');
//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//使用自执行函数，将图片名信息转换为图片URL
imageDatas = (function genImageURL(imageDatasArr){
	for (let i = 0,j = imageDatasArr.length; i < j; i++) {
		var singleImagesData = imageDatasArr[i];

		singleImagesData.imageURl = require('../images/' + singleImagesData.fileName);

		imageDatasArr[i] = singleImagesData;
	}

	return imageDatasArr;
})(imageDatas);


//获取区间内的一个随机值
function getRangeRandom(low,high){
	return Math.ceil(Math.random()*(high - low) + low);
}

var ImgFigure = React.createClass({
	render: function(){

		var styleObj = {};

		//如果props属性是指定了这张图片的样式信息，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return(
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>


			);
	}
});

//imageDatas = genImageURL(imageDatas); 不使用自执行函数的办法

class AppComponent extends React.Component {

	constructor(props){
		super(props);
		this.Constant = {
		centerPos: { //中心图片
			left:0,
			right:0
		},
		hPosRange: { //左右两分区取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange: { //上下分区取值范围
			x:[0,0],
			topY:[0,0]
		}
	};
		this.state = {
			imgsArrangeArr:[
				// {
				// 	pos:{
				// 		left:'0',
				// 		top:'0'
				// 	}
				// }
			]
		};
	}


	

	/*
	*重新布局所有图片
	*@param centerIndex 指定居中排布哪个图片
	*/
	rearrange(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecx = hPosRange.leftSecX,
			hPosRangeRightSecx = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeX = vPosRange.x,
			vPosRangeTopY = vPosRange.topY,

			imgsArrangeTopArr = [],

			topImgNum =Math.ceil(Math.random()*2),//上侧区域取一个或者不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			//居中centerIndex的图片
			imgsArrangeCenterArr[0].pos = centerPos;

			//取出布局上侧的图片状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			//布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value,index){
				imgsArrangeTopArr[index].pos = {
					top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				}
			});

			//布局左右两侧的图片
			for (let i = 0,j=imgsArrangeArr.length,k = j/2;i < j; i++) {
				let hPosRangeLORX = null;

				//前半部分布局左边，后半部分布局右边
				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecx;
				}else {
					hPosRangeLORX = hPosRangeRightSecx;
				}
				imgsArrangeArr[i].pos = {
					top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				};
			}

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}
			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
			
	}

	// getInitialState(){
	// 	return{
	// 		imgsArrangeArr: [
	// 			{
					
	// 				pos:{
	// 					left: '0',
	// 					top: '0'
	// 				}
	// 			}
	// 		]
	// 	};
	// };



	//初始化图片范围
	componentDidMount(){
		//获取舞台大小
		var stageDOM = React.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);

		//拿到一个imgfigure大小
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW/2),
			halfImgH = Math.ceil(imgH/2);
		
		//计算中心图片的位置
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		
		//计算左右分区图片的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW +halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		//计算上下分区图片取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	}
  render() {

  	var controllerUnits = [],
  		imgFigures = [];

  	imageDatas.forEach(function(value,index){

  		if (!this.state.imgsArrangeArr[index]) {
  			this.state.imgsArrangeArr[index] = {
  				pos: {
  					left: 0,
  					top: 0
  				}
  			}
  		}

  		imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}/>);
  	}.bind(this));

    return (
      <section className= "stage" ref="stage">
      	<section className= "img-sec">
      		{imgFigures}
      	</section>
      	<nav className="controller-nav">
      		{controllerUnits}
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
