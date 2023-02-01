
## 预览

![image text](https://github.com/SmallPot/table-layout/blob/main/public/preview.gif)

## Install

```
npm install @smallpot/table-layout
```

## opts Attributes

| 参数 | 说明 | 类型 | 是否必传 | 默认值 |
|-|-|-|-|-|
| xDrag | 是否开启横向拖拽 | Boolean | 可选 | true |
| yDrag | 是否开启纵向拖拽 | Boolean | 可选 | true |
| rowHeight | 默认行高 | Number | 可选 | 32 |
| columnWidth | 默认列宽 | Number | 可选 | 100 |
| tableProps | table标签配置项(props) | Object | 可选 | { className:[],style:{},attr:{} } |
| tbodyProps | tbody标签配置项(props) | Object | 可选 | { className:[],style:{},attr:{} } |
| trProps | tr标签配置项(props) | Object | 可选 | { className:[],style:{},attr:{} } |
| tdProps | td标签配置项(props) | Object | 可选 | { className:[],style:{},attr:{} } |



## 标签配置项(props) 

| 字段 | 说明 | 类型 | 是否必传 | 默认值 |
|-|-|-|-|-|
| className | 标签类名，eg：["aClassName","bClassName"] | Array | 可选 | [] |
| style | 标签内联样式，eg：{ color:"red",backgroundColor:"green" } | Object | 可选 | {} |
| attr | 标签自定义属性，eg：{ isOpen:true } | Object | 可选 | {} |


## Events

| 方法名 | 说明 | 参数 | 是否必传 | 默认值 |
|-|-|-|-|-|
| active | 对象初始化，启用事件监听，这个方法必须执行 | - | - | - |
| mergeTdFn | 合并选中单元格 | - | - | - |
| disassemblyFn | 拆解选中单元格 | - | - | - |
| delEntireColumn | 删除选中单元格整列 | - | - | - |
| delEntireRow | 删除选中单元格整行 | - | - | - |
| insertColumnBefore | 选中单元格左侧插入列 | Number | 可选 | 1 |
| insertColumnAfter | 选中单元格右侧插入列 | Number | 可选 | 1 |
| insertRowAhead | 在选中单元格前方插入行 | Number | 可选 | 1 |
| insertRowBehind | 在选中单元格后方插入行 | Number | 可选 | 1 |
| cancelAllSelected | 取消选中单元格 | - | - | - |
| setOpts | 设置opts | Object | 必填 | {} |
| setSelectAreaStyle | 设置选择区域样式 | Object | 可选 | { width:"",height:"",boxSizing:"border-box",backgroundColor:"rgba(0, 0, 0, 0.1)",border:"2px solid rgb(31, 187, 125)",position: "absolute",left:"",top:"",pointerEvents:"none"} |
| getSelectArr | 获取选中单元格 | - | - | - |



## Example

```
<div class="menu">
     <button type="button" id="mergeTd" >合并</button>
     <button type="button" id="insertColumnAfter">右侧插入列</button>
</div>

<table id="tableBox">
  <tr>
    <td>单元格</td>
    <td>单元格</td>
    <td>单元格</td>
    <td>单元格</td>
  </tr>
  <tr>
    <td>单元格</td>
    <td>单元格</td>
    <td>单元格</td>
    <td>单元格</td>
  </tr>
</table>


<script type="module">
  import TableLayout from "@smallpot/table-layout/lib"

  let obj=new TableLayout(document.getElementById("tableBox"),{
    yDrag:false,//是否开启纵向拖拽
    tableProps:{
      className:[],
      style:{},
      attr:{}
    }
  });

  obj.active();//这个方法必须执行

   document.getElementById("mergeTd").addEventListener('click',e=>{
      obj.mergeTdFn();
   })
   document.getElementById("insertColumnAfter").addEventListener('click',e=>{
      obj.insertColumnAfter(1);
   })

</script>
```
