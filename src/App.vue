<template>
  <div id="app">
    <div class="menu">
       <button type="button" id="mergeTd">合并</button>
			 <button type="button" id="disassemblyFn">拆解</button>
			 <button type="button" id="clearSelect">清除选中</button>
			 <button type="button" id="delEntireColumn">删除整列</button>
			 <button type="button" id="delEntireRow">删除整行</button>
			 <button type="button" id="insertColumnBefore">左侧插入列</button>
			 <button type="button" id="insertColumnAfter">右侧插入列</button>
			 <button type="button" id="insertRowAhead">在前方插入行</button>
			 <button type="button" id="insertRowBehind">在后方插入行</button>
    </div>
    <div class="container">
      <table id="tableBox">
        <tr>
            <td>0</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td rowspan="2">12</td>
            <td>13</td>
            <td colspan="2">14</td>
        </tr>
        <tr >
            <td>1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td>亚瑟1</td>
            <td rowspan="2">亚瑟1</td>
            <td colspan="2" rowspan="2">亚瑟1</td>
        </tr>
        <tr >
            <td>2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
            <td>亚瑟2</td>
        </tr>
        <tr >
            <td>3</td>
            <td rowspan="3">亚瑟3</td>
            <td colspan="2" rowspan="4">亚瑟3....</td>
            <td>亚瑟3</td>
            <td colspan="4">亚瑟3</td>
            <td>亚瑟3</td>
            <td>亚瑟3</td>
            <td>亚瑟3</td>
            <td>亚瑟3</td>
            <td>亚瑟3</td>
            <td>亚瑟3</td>
            <td>亚瑟3</td>
        </tr>
        <tr >
            <td>4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
            <td>亚瑟4</td>
         
        </tr>
        <tr >
            <td>5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
            <td>亚瑟5</td>
    
        </tr>
        <tr >
            <td>6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
            <td>亚瑟6</td>
        </tr>
        <tr >
            <td>7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td colspan="4" rowspan="4">亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
            <td>亚瑟7</td>
        </tr>
        <tr >
            <td>8</td>
            <td>亚瑟8</td>
            <td>亚瑟8</td>
            <td>亚瑟8</td>
            <td>亚瑟8</td>
            <td colspan="4" rowspan="2">亚瑟8</td>
            <td>亚瑟8</td>
            <td>亚瑟8</td>
            <td>亚瑟8</td>
        </tr>
        <tr >
            <td>9</td>
            <td>亚瑟9</td>
            <td>亚瑟9</td>
            <td>亚瑟9</td>
            <td>亚瑟9</td>
            <td>亚瑟9</td>
            <td>亚瑟9</td>
            <td>亚瑟9</td>
       

        </tr>
        <tr >
            <td>10</td>
            <td>亚瑟10</td>
            <td>亚瑟10</td>
            <td>亚瑟10</td>
            <td colspan="3" rowspan="4">亚瑟10***</td>
            <td>亚瑟10ss</td>
            <td>亚瑟10dd</td>
            <td>亚瑟10</td>
            <td>亚瑟10</td>
            <td>亚瑟10</td>
        </tr>
        <tr >
            <td>11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
            <td>亚瑟11</td>
        </tr>
        <tr >
            <td>12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
            <td>亚瑟12</td>
        </tr>
        <tr >
            <td>13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td rowSpan="4">亚瑟13pp</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
            <td>亚瑟13</td>
        </tr>
        <tr >
            <td>14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
            <td>亚瑟14</td>
        </tr>
        <tr >
            <td>15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
            <td>亚瑟15</td>
        </tr>
        <tr >
            <td>16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
            <td>亚瑟16</td>
        </tr>
        <tr >
            <td>17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
            <td>亚瑟17</td>
        </tr>
        <tr >
            <td>18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
            <td>亚瑟18</td>
        </tr>
        <tr >
            <td colspan="16">19</td>
        </tr>
				<tr >
				    <td colspan="16" rowspan="2">***********</td>
				</tr>
				<tr >
					<!-- <td>亚瑟v</td> -->
				</tr>
        <tr >
            <td>20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
            <td>亚瑟20</td>
        </tr>
        <tr >
            <td>21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
            <td>亚瑟21</td>
        </tr>
        <tr >
            <td colspan="2" rowspan="2">22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
            <td>亚瑟22</td>
        </tr>
        <tr >
            <td>亚瑟23b</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
            <td>亚瑟23</td>
        </tr>
        <tr >
            <td>24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
            <td>亚瑟24</td>
        </tr>
        <tr >
            <td>25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td>亚瑟25</td>
            <td rowspan="2">亚瑟25</td>
        </tr>
        <tr >
            <td>26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
            <td colspan="2">亚瑟26</td>
            <td>亚瑟26</td>
            <td>亚瑟26</td>
        </tr>
    </table>
    </div>
  </div>
</template>

<script>

import  TableLayout from "../lib/index.js"
export default {
  name: 'App',
  components: {
  },
  data(){
    return{
   
    }
  },
  mounted(){
    let obj=new  TableLayout(document.getElementById("tableBox"),{
		 rowHeight:60,
		 columnWidth:200
	 });
	  obj.active();
    
    document.getElementById("mergeTd").addEventListener('click',()=>{
      obj.mergeTdFn();
    })
    document.getElementById("disassemblyFn").addEventListener('click',()=>{
        obj.disassemblyFn();
    })
    document.getElementById("clearSelect").addEventListener('click',()=>{
        obj.cancelAllSelected();
    })
    document.getElementById("delEntireColumn").addEventListener('click',()=>{
        obj.delEntireColumn();
    })
    document.getElementById("delEntireRow").addEventListener('click',()=>{
        obj.delEntireRow();
    })
    document.getElementById("insertColumnAfter").addEventListener('click',()=>{
        obj.insertColumnAfter();
    })
    document.getElementById("insertColumnBefore").addEventListener('click',()=>{
        obj.insertColumnBefore();
    })
    document.getElementById("insertRowBehind").addEventListener('click',()=>{
        obj.insertRowBehind();
    })
    document.getElementById("insertRowAhead").addEventListener('click',()=>{
        obj.insertRowAhead();
    })
 

  }
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
}
body {
    position: relative;
}
table {
    border-collapse: collapse;
    position: relative;
    left: 0;
    top: 0;
    table-layout:fixed ;
}
td {
    border: 1px solid #d4d4d4;
    padding: 5px 0px;
    text-align: center;
    /* cursor: default; */
    color: #000;
    width: 100px;
    height: 20px;

}
.menu{
  position: fixed;
  left: 0;
  top: 0;
  padding: 10px
}
.menu>button {
  margin-right: 10px;
}
.container{
  height: 700px;
  overflow: auto;
  margin-top: 50px;
  border: 1px solid #000;
}
</style>
