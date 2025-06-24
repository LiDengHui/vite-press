# BFC布局


## 解决问题

1. 浮动定位
2. 消除外边距折叠
3. 清楚浮动
4. 自适应多拦布局

## BFC创建

1. 根元素或包含根元素的元素
2. 浮动元素(float不为none)
3. 绝对定位元素(position为absolute或者fixed)
4. display为inline-block，table-cell，table-caption
5. overflow不为visible
6. 弹性布局(flex布局)
7. 网格布局(grid布局)

## BFC约束条件

1. 内部BOX会在垂直方向一个接一个的放置
2. 垂直方向上的距离由margin决定。属于同一BFC的两个相邻Box的margin会发生重叠
3. 每个元素的左外边距与包含块的左外边界相接触(从左向右)
4. BFC的区域不会与float元素区域重叠
5. 计算BFC区域的高度，浮动子元素也参与计算
6. BFC为独立容器，容器里面的子元素不会影响到外面元素

## Examples

> margin重叠

1. 重叠

```html
<body>
	<p>top</p>
	<p>bottom</p>
</body>

<style>
p {
	width: 100px;
	height: 100px;
	background: yellow;
	line-height: 100px;
	margin: 10px;
	text-align: center;
}
</style>
```
![20190813125350.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125350.png)

2. 不重叠

```html
<body>
	<p>top</p>
	<div>
		<p>bottom</p>
	</div>
</body>
<style>
p {
	width: 100px;
	height: 100px;
	background: yellow;
	line-height: 100px;
	margin: 10px;
	text-align: center;
}

div	{
	overflow: auto;
}

</style>
```
![20190813125339.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125339.png)

> 让浮动元素等高

1. 不等高

```html
<div class="box">
    <div class="float">浮动元素</div>
    <p>未浮动元素</p>
</div>
<style>
.box {
    background-color: rgb(224, 206, 247);
    border: 5px solid rebeccapurple;
}

.float {
    float: left;
    width: 200px;
    height: 150px;
    background-color: white;
    border:1px solid black;
    padding: 10px;
}      
</style>
```
![20190813125311.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125311.png)

2. 等高

```html
<div class="box">
    <div class="float">浮动元素</div>
    <p>未浮动元素</p>
</div>
<style>
.box {
    background-color: rgb(224, 206, 247);
    border: 5px solid rebeccapurple;
    overflow: auto;
}

.float {
    float: left;
    width: 200px;
    height: 150px;
    background-color: white;
    border:1px solid black;
    padding: 10px;
}      
</style>
```
![20190813125635.png](https://raw.githubusercontent.com/LiDengHui/images/master/img20190813125635.png)
