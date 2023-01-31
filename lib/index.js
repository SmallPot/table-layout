import {deepmerge} from "./tool.js"

class TableLayout { 
constructor(el,opts={}) {
  this.el=el;//当前表格dom对象
  this.opts=deepmerge(this.defaultOpts(),opts);
  
  this.tableArr=[];//表格以二维数组的形式存储[[单元格dom,单元格dom],[单元格dom,单元格dom]...]
  this.tableJson={};//表格以键值的形式存储eg: {1-1:单元格dom,1-2:单元格dom,...}
  this.selectArr=[];//已选中的单元格
  
  this.selectedJson={
    isSelecting:false,//是否开始选择单元格
    rowMin:null,//选中单元格的最小行编号
    rowMax:null,//选中单元格的最大行编号
    cellMin:null,//选中单元格的最小列编号
    cellMax:null,//选中单元格的最大列编号
    mousedownTd:null,
    mousemoveTd:null,
    mouseupTd:null,
  };
  
  this.dragJson={
    isStartDrag:false,//是否开始拖拽
    isDragX:false,//横向是否在被拖拽
    isDragY:false,//纵向是否在被拖拽
    dragEl:null,//被拖拽的单元格
    oldX:null,//拖拽前的坐标
    oldY:null,//拖拽后的坐标
    colItem:null,//当前被拖拽单元格对应的colgroup
    rowItem:null,//当前被拖拽的行
    colItemWidth:null,//当前被拖拽单元格对应的colgroup的初始宽度
    rowItemHeight:null//当前被拖拽的行的初始高度
  };
  
  
  this.selectAreaStyle={
    width:"",
    height:"",
    boxSizing:"border-box",
    backgroundColor:"rgba(0, 0, 0, 0.1)",
    border:"2px solid rgb(31, 187, 125)",
    position: "absolute",
    left:"",
    top:"",
    pointerEvents:"none",
    
  }
  
  
}
active(){
  if(!this.el){
    return false;
  }
  this.createSelectArea();
  
  this.init();
  this.delegate(this.el,  'click','td', (e,el)=> {
    this.multipleChoice(e,el)
  });

  this.delegate(this.el,  'mousedown','td', (e,el)=> {
    this.startSelection(e,el);
    this.startDrag(e,el)
  });

  this.delegate(this.el,  'mousemove','td', (e,el)=> {
    this.selecting(e,el);
    this.readyDrag(e,el);
    this.dragging(e,el);
    
  });

  this.delegate(document,  'mouseup','td', (e,el)=> {
    this.endSelection(e,el);
    this.endDrag(e,el)	
  });
  
  
  this.el.addEventListener('mousedown',()=>{
    this.setSelectArea()
  })
  this.el.addEventListener('mousemove',()=>{
    this.setSelectArea()
  })
  
  
}
//多选
multipleChoice(e,el){
  if(e.shiftKey){
    if(this.selectArr.length>0){
      this.addSelected([...this.selectArr,el])
    }else{
      this.addSelected([this.selectedJson["mousedownTd"],this.selectedJson["mousemoveTd"],el]);
    }
  }
}
//开始选择
startSelection(e,el){
  if(this.dragJson['isDragX']||this.dragJson['isDragY']){
    return false;
  }
  if(!this.selectedJson["isSelecting"]&&!e.shiftKey){
        this.cancelAllSelected();
        this.selectedJson["mousemoveTd"]=null;
        this.selectedJson["mouseupTd"]=null;
        this.selectedJson["isSelecting"]=true;
        this.selectedJson["mousedownTd"]=el;
        this.addSelected([this.selectedJson["mousedownTd"]]);
  }
}
//正在选择
selecting(e,el){
  if(this.selectedJson["isSelecting"]&&!e.shiftKey){
    if(!this.selectedJson["mousemoveTd"]){
      this.selectedJson["mousemoveTd"]=el;
    }else{
      let num1= this.selectedJson["mousemoveTd"].getAttribute("td_num"); 
      let num2= el.getAttribute("td_num"); 
      if(num1!=num2){
        this.selectedJson["mousemoveTd"]=el;
        this.cancelAllSelected();
        this.addSelected([this.selectedJson["mousedownTd"],this.selectedJson["mousemoveTd"]]);
      }
    }
    
  }
}
//结束选择
endSelection(e){
  if(this.selectedJson["isSelecting"]&&!e.shiftKey){
    this.selectedJson["isSelecting"]=false;
  }
}

//准备拖拽(用于判断是否可拖拽)
readyDrag(e,el){
  if(this.selectedJson["isSelecting"]){
    return false;
  }
  
  let boundingClientRect=el.getBoundingClientRect();
  let tdRight=boundingClientRect['x']+el.offsetWidth;
  let tdBottom=boundingClientRect['y']+el.offsetHeight;
  if((this.opts['xDrag']&&!this.dragJson['isDragY']&&tdRight-e.clientX<=8)||
     (this.opts['xDrag']&&this.dragJson['isStartDrag']&&this.dragJson['isDragX'])){
          el.style.cursor="col-resize";
          this.dragJson['isDragX']=true;
  }else if((this.opts['yDrag']&&!this.dragJson['isDragX']&&tdBottom-e.clientY<=8)||
           (this.opts['yDrag']&&this.dragJson['isStartDrag']&&this.dragJson['isDragY'])){
          el.style.cursor="row-resize";
          this.dragJson['isDragY']=true;
  }else{
          el.style.cursor="context-menu";
          this.dragJson['isDragX']=false;
          this.dragJson['isDragY']=false;
  }
  
}
//开始拖拽
startDrag(e,el){
  if(this.dragJson['isDragX']){
    let colgroup =this.el.querySelector('colgroup')
    let cols=[...colgroup.childNodes].filter(item=>{
      return item.nodeName.toUpperCase()=="COL";
    });
     this.dragJson['isStartDrag']=true
     this.dragJson['oldX'] = e.clientX;
     this.dragJson['oldY']  = e.clientY;
     this.dragJson['dragEl']=el;
     let td_num_obj=null;
     if(this.dragJson['dragEl'].colSpan > 1){
       td_num_obj=this.getRowCellNum(this.dragJson['dragEl'],"end_td");
     }else{
       td_num_obj=this.getRowCellNum(this.dragJson['dragEl'],"td_num");
     }
     let n=td_num_obj['col'];
     this.dragJson['colItem']=cols[n]
     this.dragJson['colItemWidth']=Number(this.dragJson['colItem'].width);
     this.dragJson['colItem'].setAttribute("move",true);
     
  }else if(this.dragJson['isDragY']){
     this.dragJson['isStartDrag']=true
     this.dragJson['oldX'] = e.clientX;
     this.dragJson['oldY']  = e.clientY;
     this.dragJson['dragEl']=el;
     
     this.dragJson['rowItem']=el.parentElement;
     this.dragJson['rowItemHeight']=Number(this.dragJson['rowItem'].getAttribute("height"));
     this.dragJson['rowItem'].setAttribute("move",true);

  }
}
//正在拖拽
dragging(e){

  if(!this.dragJson['isStartDrag']){
    return;
  }
  if(this.dragJson['colItem']){
       let move= this.dragJson['colItem'].getAttribute("move");
      if(move){
        let w=this.dragJson['colItemWidth']+(e.clientX - this.dragJson['oldX']);
        let newColItemWidth=w>=this.opts['columnWidth']?w:this.opts['columnWidth'];
        this.dragJson['colItem'].width=newColItemWidth
      }
  }else if(this.dragJson['rowItem']){
      let move= this.dragJson['rowItem'].getAttribute("move");
      if(move){
        let h=this.dragJson['rowItemHeight']+(e.clientY - this.dragJson['oldY']);
        let newRowHeight=h>=this.opts['rowHeight']?h:this.opts['rowHeight']
        this.dragJson['rowItem'].setAttribute("height",newRowHeight);

      }
  }
}
//结束拖拽
endDrag(){

    this.dragJson['colItem']&&this.dragJson['colItem'].removeAttribute("move");
    this.dragJson['rowItem']&&this.dragJson['rowItem'].removeAttribute("move");
    this.dragJson={
        isStartDrag:false,
        isDragX:false,
        isDragY:false,
        dragEl:null,
        oldX:null,
        oldY:null,
        colItem:null,
        rowItem:null,
        colItemWidth:null,
        rowItemHeight:null
      }
  
}
init(){
  this.setSelectAreaSizeAndPosition(0,0,0,0);
  let table= this.initTable(this.el);
  let tbody=this.el.querySelector('tbody');
  this.initTbody(tbody);
  let rows=[...table.rows];
  this.tableArr = Array.from({length: rows.length}, () =>[]);
  let row_repeat={};
  let rowMaxLen=rows[0];//单元格最多的行
  
  rows.forEach((trItem,trIndex)=>{
    let tr_item=this.initTr(trItem);
    let cells = [...tr_item.cells];
    if(rowMaxLen){
      let oldCells=[...rowMaxLen.cells];
      if(cells.length>oldCells.length){
        rowMaxLen=tr_item;
      }
    }

    cells.forEach((tdItem)=>{
      let td_item=this.initTd(tdItem);
      if(td_item.colSpan > 1){
          for(let c=1;c<td_item.colSpan;c++){
            this.tableArr[trIndex].push(td_item);
          }
      }
      if(td_item.rowSpan > 1){
          for(let r=1;r<td_item.rowSpan;r++){
            let row_num=trIndex+r;
            for(let c=0;c<td_item.colSpan;c++){
              if(!row_repeat[row_num]){
                row_repeat[row_num]=[]
              }
              row_repeat[row_num].push(td_item);
            }
          }
      }
      this.tableArr[trIndex].push(td_item);
    })
  })
  
  this.createColgroup(rowMaxLen,(res)=>{
    let tableWidth=0;
    let cols=[...res.childNodes].filter(item=>{
      return item.nodeName.toUpperCase()=="COL"
    });
    cols.forEach(item=>{
      tableWidth+=Number(item.width);
    })
    this.el.width=tableWidth;
  });
  

  
  //重新排序
  for (let tr_index in row_repeat) {
    let cells=row_repeat[tr_index];
    this.tableArr[tr_index].push(...cells)
    this.tableArr[tr_index].sort((a,b)=>a.offsetLeft-b.offsetLeft);
  }
  this.setSign();
  
  this.cancelAllSelected();
  
  
  
  
  
}
//跨行跨列的单元格设置起止标记
setSign(){
  let table_arr=this.tableArr&&this.tableArr.length>0?this.tableArr:[];
  let table_json={};
   table_arr.forEach((tr_item,tr_index)=>{
      tr_item.forEach((td_item,td_index)=>{
        table_json[`${tr_index}-${td_index}`]=td_item;
        let td_num= td_item.getAttribute("td_num");
        if(!td_num){
          td_item.setAttribute("td_num",`${tr_index}-${td_index}`);
        }
        
        if(td_item.colSpan > 1||td_item.rowSpan > 1){
          let start_td= td_item.getAttribute("start_td");
          let end_td= td_item.getAttribute("end_td");
          if(!start_td){
            td_item.setAttribute("start_td",`${tr_index}-${td_index}`);
          }
          if(!end_td){
             td_item.setAttribute("end_td",`${tr_index+td_item.rowSpan-1}-${td_index+td_item.colSpan-1}`);
          }
           
        }
        
      })
      
   })
   this.tableJson=table_json;
}
//事件代理
delegate(element, eventType, selector, fn){
  element.addEventListener(eventType, evt => {
    let e=evt || window.event
    e.preventDefault();
    let el = e.target
    while (el.matches&&!el.matches(selector)) {
      if (element === el) {
        el = null
        break
      }
      el = el.parentNode
    }
    el && fn.call(el, e, el)
  })
  return element
}
//选中单元格
addSelected(tdArr){
  if(tdArr&&tdArr.length>0){
    this.selectArr=[];
    let td_limit=this.getCellNumLimit(tdArr);
    const fn=(table_json,rowMin,rowMax,cellMin,cellMax)=>{
       for (let key in table_json) {
         let td_item=table_json[key];
         let arr=key.split("-");
         let item_num_arr=[Number(arr[0]),Number(arr[1])]
         if((item_num_arr[0]>=rowMin&&item_num_arr[0]<=rowMax)&&
            (item_num_arr[1]>=cellMin&&item_num_arr[1]<=cellMax))
         {
                    td_item.setAttribute("selected",true);
                   this.selectArr.push(td_item)
         }
        
         
       }
       
       let td_limit_next=this.getCellNumLimit(this.selectArr);
       let w=td_limit_next["cell_max"]-td_limit_next["cell_min"]+1;
       let h=td_limit_next["row_max"]-td_limit_next["row_min"]+1;
       this.selectedJson["rowMin"]=td_limit_next['row_min'];
       this.selectedJson["rowMax"]=td_limit_next['row_max'];
       this.selectedJson["cellMin"]=td_limit_next['cell_min'];
       this.selectedJson["cellMax"]=td_limit_next['cell_max'];
       if(w*h!==this.selectArr.length){
         this.selectArr=[];
         fn(this.tableJson,td_limit_next['row_min'],td_limit_next['row_max'],td_limit_next['cell_min'],td_limit_next['cell_max']);
       }
       
    }
    fn(this.tableJson,td_limit['row_min'],td_limit['row_max'],td_limit['cell_min'],td_limit['cell_max']);
    
    
    
  }
}

//取消选中单元格
cancelAllSelected(){
  this.selectedJson["rowMin"]=null;
  this.selectedJson["rowMax"]=null;
  this.selectedJson["cellMin"]=null;
  this.selectedJson["cellMax"]=null;
  this.selectArr=[];
  this.setSelectAreaSizeAndPosition(0,0,0,0);
   if(this.tableArr&&this.tableArr.length>0){
     this.tableArr.forEach((tr_item)=>{
          tr_item.forEach((td_item)=>{
             td_item.removeAttribute("selected");
          })
     })
   }
}


getRowCellNum(el,type){
  if(!el||!type){
    return {};
  }
  let type_str=el.getAttribute(type);
  if(type_str){
    let arr=type_str.split("-");
    return {
      row:Number(arr[0]),
      col:Number(arr[1])
    }
  }
  return {}
}


getCellNumLimit(cellArr=[]){
  const getMaxAndMinFn=(arr)=>{
    let newArr=arr.filter(n => n!=null);
    newArr.sort((a,b)=>a-b);
    return{
      min:newArr[0],
      max:newArr[newArr.length-1]
    }
  }
  
  let row_arr=[];
  let col_arr=[];
  let cellArrFilter=cellArr.filter(n => n!=null);
  
  
  cellArrFilter.forEach((td_item)=>{
     let td_num_obj=this.getRowCellNum(td_item,"td_num");
     row_arr.push(td_num_obj['row']);
     col_arr.push(td_num_obj['col'])
     if(td_item.rowSpan > 1||td_item.colSpan > 1){
       let start_td_obj=this.getRowCellNum(td_item,"start_td");
       let end_td_obj=this.getRowCellNum(td_item,"end_td");
       row_arr.push(start_td_obj['row']);
       col_arr.push(start_td_obj['col']);
       row_arr.push(end_td_obj['row']);
       col_arr.push(end_td_obj['col'])
     }
  })
  
  let rowLimit=getMaxAndMinFn(row_arr);
  let cellLimit=getMaxAndMinFn(col_arr);
  
  
  let row_min=rowLimit['min'];
  let row_max=rowLimit['max'];
  let cell_min=cellLimit['min'];
  let cell_max=cellLimit['max'];
  
  return {
    row_min,
    row_max,
    cell_min,
    cell_max
  }
}

//合并单元格
mergeTdFn(){
  if(this.selectArr&&this.selectArr.length===0){
    alert("没有选中的单元格")
    return false;
  }
  let key=`${this.selectedJson["rowMin"]}-${this.selectedJson["cellMin"]}`;
  let parentNode = this.tableJson[key].parentElement;
  let fragmentTd=document.createDocumentFragment();
  let fragmentTdChildren=document.createDocumentFragment();
  
  this.selectArr.forEach((item)=>{
    let td_num= item.getAttribute("td_num");
    let arr=[...item.childNodes];
    arr.forEach((itemChildNode)=>{
      fragmentTdChildren.appendChild(itemChildNode);
    })
    
    if(td_num!==key){
      fragmentTd.appendChild(item);
    }
    
  })

  
  let newTd = this.tableJson[key].cloneNode(true);
  newTd.rowSpan=(this.selectedJson["rowMax"]-this.selectedJson["rowMin"])+1;
  newTd.colSpan=(this.selectedJson["cellMax"]-this.selectedJson["cellMin"])+1;
  newTd.appendChild(fragmentTdChildren);

  parentNode&&parentNode.replaceChild(newTd,this.tableJson[key]);
  fragmentTd=null;
  this.init();
}

//拆解单元格
disassemblyFn(){
  if(this.selectArr&&this.selectArr.length===0){
    alert("没有选中的单元格")
    return false;
  }
  let map=new Map();//要拆解的单元格
  this.selectArr.forEach((item)=>{
    if(item.rowSpan>1||item.colSpan>1){
      if(map.has(item)){
        let nub=map.get(item)+1;
        map.set(item,nub);
      }else{
        map.set(item,1);
      }
    }
  })
  
  this.tableArr.forEach((rowItem,RIndex)=>{
    rowItem.forEach((tdItem,CIndex)=>{
      if(map.has(tdItem)){
        let tdNumObj=this.getRowCellNum(tdItem,"td_num");
        if(tdNumObj["row"]==RIndex&&tdNumObj["col"]==CIndex){
          tdItem.rowSpan=1;
          tdItem.colSpan=1;
        }else{
          let newTd = this.createTd();
          rowItem.splice(CIndex,1,newTd);
        }
        
        
      }
    })
  })
  
  let newTbody=this.tableArrToDom(this.tableArr);
  let tbody=this.el.querySelector('tbody')
  this.el.replaceChild(newTbody,tbody);
  this.init();
  
}

//删除整列
delEntireColumn(){
  if(this.selectArr&&this.selectArr.length===0){
    alert("没有选中的单元格")
    return false;
  }
  let colgroup =this.el.querySelector('colgroup')
  let fragment=document.createDocumentFragment();
  let tempJson={};
  let map=new Map();
  let cols=[...colgroup.childNodes].filter(item=>{
    return item.nodeName.toUpperCase()=="COL"
  });
  
  cols.forEach((item,index)=>{
    if(index>=this.selectedJson["cellMin"]&&index<=this.selectedJson["cellMax"]){
      fragment.appendChild(item);
    }
  })
  
  
  
  for (let key in this.tableJson) {
    let td_item=this.tableJson[key];
    let arr=key.split("-");
    let itemKey={
      row:Number(arr[0]),
      col:Number(arr[1])
    }
    if(itemKey['col']>=this.selectedJson["cellMin"]&&itemKey['col']<=this.selectedJson["cellMax"]){
      if(td_item.colSpan>1){
        if(map.has(td_item)){
          let nub=map.get(td_item)+1;
          map.set(td_item,nub);
        }else{
          map.set(td_item,1);
        }
        let td_num=td_item.getAttribute("td_num");
        tempJson[td_num]=td_item;
      }else{
        fragment.appendChild(td_item);
      }
    }
            
    
  }
  
  for (let key in tempJson) {
    let td_item=tempJson[key];
    let nub=parseInt(map.get(td_item)/td_item.rowSpan);
      if(td_item.colSpan-nub>0){
        td_item.colSpan=td_item.colSpan-nub;
        td_item.removeAttribute("start_td");
        td_item.removeAttribute("end_td");
      }else{
        fragment.appendChild(td_item);
      }
    
  }
  map=null;
  tempJson=null;
  fragment=null;
  
  this.init();
  
  
}


//table_arr转dom树
tableArrToDom(tableArr){
  let fragment=document.createDocumentFragment();
  let newTbody = document.createElement('tbody');
  let tbody=this.el.querySelector('tbody');
  if(tbody){
    newTbody=tbody.cloneNode();
  }
  tableArr.forEach((rowItem,RIndex)=>{
    if(rowItem.length>0){//rowItem.length等于0表示要删除的行
      let newTr = this.createTr();
      let oldTr=rowItem[0].parentNode;
      let height=this.opts['rowHeight'];
      if(oldTr){
        newTr = oldTr.cloneNode();
        height=oldTr.getAttribute("height")||this.opts['rowHeight'];
      }
      newTr.setAttribute("height",height);
      rowItem.forEach((tdItem)=>{
        let tdNumObj=this.getRowCellNum(tdItem,"td_num");
         if(tdNumObj["row"]==RIndex){
          newTr.appendChild(tdItem);
        }else if(!tdNumObj["row"]&&tdNumObj["row"]!=0){
          newTr.appendChild(tdItem);
        }
        
      })
      fragment.appendChild(newTr);
    }
    
  })
  newTbody.appendChild(fragment);
  return newTbody;
}

//删除整行
delEntireRow(){
    if(this.selectArr&&this.selectArr.length===0){
      alert("没有选中的单元格")
      return false;
    }

    let map=new Map();
    let newArr=this.tableArr.map((rowItem,RIndex)=>{
      if(RIndex>=this.selectedJson["rowMin"]&&RIndex<=this.selectedJson["rowMax"]){
        rowItem.forEach((tdItem)=>{
          if(tdItem.rowSpan>1){//跨行的单元格收集起来，特殊处理
                  if(map.has(tdItem)){
                    let nub=map.get(tdItem)+1;//记录单元格占有数
                    map.set(tdItem,nub);
                  }else{
                    map.set(tdItem,1);
                  }
          }
          
        })
        return [];
        
      }else{
        return rowItem;
      }

    })
    
    map.forEach((num,tdItem)=>{
        console.log(num);
        let nub=parseInt(map.get(tdItem)/tdItem.colSpan);
        if(tdItem.rowSpan-nub>0){
          tdItem.rowSpan=tdItem.rowSpan-nub;
        }
        let start_td_obj=this.getRowCellNum(tdItem,"start_td");
        let end_td_obj=this.getRowCellNum(tdItem,"end_td");
        let td_num_obj=this.getRowCellNum(tdItem,"td_num");
        for(let r=start_td_obj["row"];r<=end_td_obj["row"];r++){
          if(r>=this.selectedJson["rowMin"]&&r<=this.selectedJson["rowMax"]){
            continue;
          }
          tdItem.setAttribute("td_num",`${r}-${td_num_obj['col']}`);
          break;
        }
        
    });
    
    let newTbody=this.tableArrToDom(newArr);
    let tbody=this.el.querySelector('tbody')
    this.el.replaceChild(newTbody,tbody);
    this.init();
    
    
}





//右侧插入列
insertColumnAfter(number=1){

  if(this.selectArr&&this.selectArr.length===0){
    alert("没有选中的单元格")
    return false;
  }
  let tempJson={};
  // let table=this.el;
  // let rows=[...table.rows];
  let colgroup =this.el.querySelector('colgroup')
  let cols=[...colgroup.childNodes].filter(item=>{
    return item.nodeName.toUpperCase()=="COL"
  });
  
  cols.forEach((item,index)=>{
    if(index===this.selectedJson["cellMax"]){
      let fragment=document.createDocumentFragment();
      for(let i=0;i<number;i++){
        let newCol = document.createElement('col');
        newCol.width=this.opts["columnWidth"];
        fragment.appendChild(newCol);
        
      }
      this.insertAfter(fragment,item)
      
    }
  })
  
  for (let key in this.tableJson) {
    let td_item=this.tableJson[key];
    let arr=key.split("-");
    let itemKey={
      row:Number(arr[0]),
      col:Number(arr[1])
    }
    
    if(itemKey['col']==this.selectedJson["cellMax"]){
      if(td_item.colSpan>1||td_item.rowSpan>1){
        let td_num=td_item.getAttribute("td_num");
        tempJson[td_num]=td_item;
        
      }else{
        let fragment=document.createDocumentFragment();
        for(let i=0;i<number;i++){
          let newTd = this.createTd();
          fragment.appendChild(newTd);
        }
        this.insertAfter(fragment,td_item)
        
      }
    }
            
    
  }
  let newTrJson={}
  for (let key in tempJson) {
    let td_item=tempJson[key];
    let start_td_obj=this.getRowCellNum(td_item,"start_td");
    let end_td_obj=this.getRowCellNum(td_item,"end_td");
    if(end_td_obj["col"]===this.selectedJson["cellMax"]){
      for(let r=start_td_obj["row"];r<=end_td_obj["row"];r++){
        newTrJson[r]=[];
        this.tableArr[r].forEach((td,index)=>{
          newTrJson[r].push(td)
          if(index===end_td_obj["col"]){
            for(let i=0;i<number;i++){
              let newTd = this.createTd();
              newTrJson[r].push(newTd);
            }
          }
          
        })
      }
    }else{
      td_item.colSpan=td_item.colSpan+number;
    }
    
  }

  this.updateTrFn(newTrJson);
  this.init();
  
}
//左侧插入列
insertColumnBefore(number=1){
  if(this.selectArr&&this.selectArr.length===0){
    alert("没有选中的单元格")
    return false;
  }
  let colgroup =this.el.querySelector('colgroup')
  let tempJson={};
  let cols=[...colgroup.childNodes].filter(item=>{
    return item.nodeName.toUpperCase()=="COL"
  });
  
  cols.forEach((item,index)=>{
    if(index===this.selectedJson["cellMax"]){
      let fragment=document.createDocumentFragment();
      for(let i=0;i<number;i++){
        let newCol = document.createElement('col');
        newCol.width=this.opts["columnWidth"];//
        fragment.appendChild(newCol);
      }
      colgroup.insertBefore(fragment,item);
      
    }
  })
  
  for (let key in this.tableJson) {
    let td_item=this.tableJson[key];
    let parent = td_item.parentNode;
    let arr=key.split("-");
    let itemKey={
      row:Number(arr[0]),
      col:Number(arr[1])
    }
    
    if(itemKey['col']==this.selectedJson["cellMin"]){
      if(td_item.colSpan>1||td_item.rowSpan>1){
        let td_num=td_item.getAttribute("td_num");
        tempJson[td_num]=td_item;
        
      }else{
        let fragment=document.createDocumentFragment();
        for(let i=0;i<number;i++){
          let newTd = this.createTd();
          fragment.appendChild(newTd);
        }
        parent.insertBefore(fragment,td_item);
        
      }
    }
            
    
  }
  let newTrJson={}
  for (let key in tempJson) {
    let td_item=tempJson[key];
    let start_td_obj=this.getRowCellNum(td_item,"start_td");
    let end_td_obj=this.getRowCellNum(td_item,"end_td");
    if(start_td_obj["col"]===this.selectedJson["cellMin"]){
      for(let r=start_td_obj["row"];r<=end_td_obj["row"];r++){
        newTrJson[r]=[];
        this.tableArr[r].forEach((td,index)=>{
          if(index===start_td_obj["col"]){
            for(let i=0;i<number;i++){
              let newTd = this.createTd();
              newTrJson[r].push(newTd);
            }
          }
          newTrJson[r].push(td)
        })
      }
      
    }else{
      td_item.colSpan=td_item.colSpan+number;
    }
    
  }
  this.updateTrFn(newTrJson);
  this.init();
  
}
//在后方插入行
insertRowBehind(number=1){
  if(this.selectArr&&this.selectArr.length===0){
    alert("没有选中的单元格")
    return false;
  }
  let tempJson={};
  let table=this.el;
  let rows=[...table.rows];
  let fragment=document.createDocumentFragment();
  let newTr = this.createTr();
  newTr.setAttribute("height",this.opts['rowHeight']);
  
  for (let key in this.tableJson) {
    let td_item=this.tableJson[key];
    let arr=key.split("-");
    let itemKey={
      row:Number(arr[0]),
      col:Number(arr[1])
    }
    
    if(itemKey['row']==this.selectedJson["rowMax"]){
      if(td_item.rowSpan>1){
        let td_num=td_item.getAttribute("td_num");
        tempJson[td_num]=td_item;
        
      }else{
        let newTd = this.createTd();
        newTr.appendChild(newTd);
        
      }
    }
            
    
  }
  for (let key in tempJson) {
    let td_item=tempJson[key];
    let end_td_obj=this.getRowCellNum(td_item,"end_td");
    if(end_td_obj['row']===this.selectedJson["rowMax"]){
      for(let i=0;i<td_item.colSpan;i++){
        let newTd = this.createTd();
        newTr.appendChild(newTd);
      }
    }else{
      td_item.rowSpan=td_item.rowSpan+number;
    }
    
  }
  
  for(let i=0;i<number;i++){
    let tr=newTr.cloneNode(true);
    fragment.appendChild(tr);
  }
  
  this.insertAfter(fragment,rows[this.selectedJson["rowMax"]])
  this.init();
  
}
//在前方插入行
insertRowAhead(number=1){
  if(this.selectArr&&this.selectArr.length===0){
    alert("没有选中的单元格")
    return false;
  }
  let tempJson={};
  let table=this.el;
  let rows=[...table.rows];
  let fragment=document.createDocumentFragment();
  let newTr = this.createTr();
  newTr.setAttribute("height",this.opts['rowHeight']);
  
  for (let key in this.tableJson) {
    let td_item=this.tableJson[key];
    let arr=key.split("-");
    let itemKey={
      row:Number(arr[0]),
      col:Number(arr[1])
    }
    
    if(itemKey['row']==this.selectedJson["rowMin"]){
      if(td_item.rowSpan>1){
        let td_num=td_item.getAttribute("td_num");
        tempJson[td_num]=td_item;
        
      }else{
        let newTd = this.createTd();
        newTr.appendChild(newTd);
        
      }
    }
            
    
  }
  for (let key in tempJson) {
    let td_item=tempJson[key];
    let start_td_obj=this.getRowCellNum(td_item,"start_td");
    if(start_td_obj['row']===this.selectedJson["rowMin"]){
      for(let i=0;i<td_item.colSpan;i++){
        let newTd = this.createTd();
        newTr.appendChild(newTd);
      }
    }else{
      td_item.rowSpan=td_item.rowSpan+number;
    }
    
  }
  
  for(let i=0;i<number;i++){
    let tr=newTr.cloneNode(true);
    fragment.appendChild(tr);
  }
  
  let parent = rows[this.selectedJson["rowMin"]].parentNode;
  parent.insertBefore(fragment,rows[this.selectedJson["rowMin"]]);
  this.init();
  
}
insertAfter(newElement,targetElement){
  //获取目标元素的父节点
  let parent = targetElement.parentNode;
  if(parent.lastChild == targetElement&&parent.appendChid){
  parent.appendChid(newElement);
  }else{
    //nextSibling是表示下一个兄弟元素节点
  parent.insertBefore(newElement,targetElement.nextSibling);
  }
}
//
updateTrFn(trJson){
  let rows=[...this.el.rows];
  let obj={}
  for (let key in trJson) {
    let parentNode = rows[key].parentNode;
    let trArr=trJson[key];
    let fragment=document.createDocumentFragment();
    let newTr = this.createTr();
    newTr.setAttribute("height",this.opts['rowHeight']);
    trArr.forEach(td=>{
      let td_num=td.getAttribute("td_num");
      let td_num_obj=this.getRowCellNum(td,"td_num");
      //obj：标记td_num，用于去重
      //td_num_obj['row']==key: 只有属于当前行的单元格才能添加到新创建的行
      if (td_num&&!obj[td_num]&&td_num_obj['row']==key) {
          newTr.appendChild(td);
          obj[td_num] = true;
      }else if(!td_num){//如果不存在td_num就是新添加的单元格，直接添加到新创建的行
        newTr.appendChild(td);
      }

    })
    fragment.appendChild(newTr);
    parentNode&&parentNode.replaceChild(fragment,rows[key]);
  }

  
}



//创建选择区域
createSelectArea(){
  if(!this.el){
    return false;
  }
  let div=document.createElement("div");
  div.className="selectArea";		
  for (let name in this.selectAreaStyle) {
    div.style[name]=this.selectAreaStyle[name];
  }
  this.el.appendChild(div);
}


//设置选择区域位置及宽高
setSelectArea(){
  let {top,left,width,height}=this.computeSelectAreaPosition(this.selectedJson["rowMin"],this.selectedJson["cellMin"],this.selectedJson["rowMax"],this.selectedJson["cellMax"]);
  this.setSelectAreaSizeAndPosition(width,height,left,top);
}

//设置选择区域样式 
setSelectAreaSizeAndPosition(width,height,left,top){
  let selectArea=document.querySelector(".selectArea");
  if(!selectArea){
    return;
  }
  selectArea.style.width=`${width}px`;
  selectArea.style.height=`${height}px`;
  selectArea.style.left=`${left}px`;
  selectArea.style.top=`${top}px`;
}

//计算选择区域位置及宽高
computeSelectAreaPosition(row_min,cell_min,row_max,cell_max){
  if(row_min!=null&&cell_min!=null&&row_max!=null&&cell_max!=null){
    let startTd=this.tableJson[`${row_min}-${cell_min}`];
    let endTd=this.tableJson[`${row_max}-${cell_max}`];
    let top=startTd.offsetTop;
    let left=startTd.offsetLeft;
    let width=(endTd.offsetLeft+endTd.offsetWidth)-left;
    let height=(endTd.offsetTop+endTd.offsetHeight)-top;
    return {
      top,
      left,
      width,
      height
    }
  }
  return {
    top:0,
    left:0,
    width:0,
    height:0
  }
}

createColgroup(row,cb){
  if(!row){
    return
  }
  let colgroup =this.el.querySelector('colgroup')
  if(!colgroup){
    let colgroup = document.createElement('colgroup');
    colgroup.setAttribute('id',"colgroup");
    let cells = [...row.cells];
    cells.forEach((td_item)=>{
      let width=this.opts["columnWidth"]?this.opts["columnWidth"]:td_item.offsetWidth;
      let col = document.createElement('col');
      col.width=width;
      colgroup.appendChild(col);
    })
    this.el.appendChild(colgroup);
    cb(colgroup);
  }
  if(colgroup&&cb){
    colgroup.setAttribute('id',"colgroup");
    cb(colgroup);
  }
}


//设置opts
setOpts(opts){
  this.opts=deepmerge(this.opts,opts);
}

//默认配置
defaultOpts(){
  return {
    xDrag:true,//是否开启横向拖拽
    yDrag:true,//是否开启纵向拖拽
    rowHeight:32,//行高
    columnWidth:100,//列宽
    tableProps:{
      className:[],
      style:{},
      attr:{}
    },
    tbodyProps:{
      className:[],
      style:{},
      attr:{}
    },
    trProps:{
      className:[],
      style:{},
      attr:{}
    },
    tdProps:{
      className:[],
      style:{},
      attr:{}
    }
  }
}


//dom对象基本初始化
baseInit(obj,propsStr){
  let props=this.opts[propsStr]?this.opts[propsStr]:{};
  let classNameArr=props["className"]?props["className"]:[];
  let styleProps=props["style"]?props["style"]:{};
  let attr=props["attr"]?props["attr"]:{};
  
  classNameArr.forEach(className=>{
    obj.classList.add(className);
  })
  for (let prop in styleProps) {
    let styleVal=styleProps[prop];
    obj.style[prop]=styleVal;
  }
  for (let name in attr) {
    let attrVal=attr[name];
    obj.setAttribute(name,attrVal);
  }
  return obj;
}


//初始化表格
initTable(table){
  let tbody=table.querySelector('tbody');
  if(!tbody){
    let tbodyEl = document.createElement('tbody');
    let rows=[...table.rows];
    rows.forEach(tr=>{
      tbodyEl.appendChild(tr);
    })
    table.appendChild(tbodyEl);
    
  }
  let dom=this.baseInit(table,"tableProps");

  return dom;
}

//初始化Tbody
initTbody(tbody){
  let dom=this.baseInit(tbody,"tbodyProps");
  return dom;
}

//初始化行
initTr(tr){
  let height=tr.getAttribute("height"); 
  if(!height){
    tr.setAttribute("height",this.opts["rowHeight"]);
  }
  let dom=this.baseInit(tr,"trProps");
  return dom;
}


//初始化单元格
initTd(td){
  td.removeAttribute("td_num");
  td.removeAttribute("start_td");
  td.removeAttribute("end_td");
  let newTd=this.baseInit(td,"tdProps");
  
  return newTd;
}

//创建行 
createTr(){
  let newTr =document.createElement('tr');
  return newTr;
}

//创建单元格
createTd(){
  let newTd = document.createElement('td');
  return newTd;
}

//获取选中单元格
getSelectArr(){
  return this.selectArr;
}

//设置选择区域样式
setSelectAreaStyle(opts={}){
  let selectArea=document.querySelector(".selectArea");
  if(!selectArea){
    return;
  }
  this.selectAreaStyle=Object.assign({},this.selectAreaStyle,opts);
  for (let name in this.selectAreaStyle) {
    selectArea.style[name]=this.selectAreaStyle[name];
  }
}



}

export default TableLayout