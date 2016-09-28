require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

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

//imageDatas = genImageURL(imageDatas); 不使用自执行函数

class AppComponent extends React.Component {
  render() {
    return (
      <section className= "stage">
      	<section className= "img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
