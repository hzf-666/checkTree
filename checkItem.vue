<template>
  <div :class="[level == 0 ? 'root-item' : 'children-item']">

    <!-- :style="level == 0 ? 'background:#ddd' : ''" -->
    <div class="item">
        <!-- 自定义选中图标 + 选项名 -->
        <template v-if="checkTree.$scopedSlots['checkedIcon']">
            <span :style="{
                    'margin': '0 10px',
                    'visibility': row.isChecked ? '' : 'hidden'
                }">
                <!-- 数字10到这里修改 -->
                <checkTreeSlot slotType="checkedIcon" :row="row"></checkTreeSlot>
            </span>
            <label @click="showIcon(row)"  :class="[{'checked':row.isChecked}, 'cursor']">
                {{row[labelName]}}
            </label>
        </template>
        <!-- 多选框 + 选项名 -->
        <template v-else>
            <input
                @change="doCheck"
                :class="{'cursor':!disabled}"
                type="checkbox"
                :id="row[idName]" 
                :checked="row.isChecked" 
                :disabled="disabled">
            <label :for="row[idName]" :class="[{'cursor':!disabled}, {'checked':row.isChecked}]">
                {{row[labelName]}}
            </label>
        </template>

        <!-- 展开、折叠图标 -->
        <template v-if="row[childrenName].length">
            <template v-if="checkTree.$scopedSlots['expandIcon']&&checkTree.$scopedSlots['foldIcon']">
                <span v-if="!row.isExpand" :style="{'margin-right':-level*10+'px'}" class="is-expand-position">
                    <!-- 数字10到这里修改 -->
                    <checkTreeSlot slotType="expandIcon" :row="row"></checkTreeSlot>
                </span>
                <span v-if="row.isExpand" :style="{'margin-right':-level*10+'px'}" class="is-expand-position">
                    <checkTreeSlot slotType="foldIcon" :row="row"></checkTreeSlot>
                </span>
            </template>     
            <template v-else>
                <span 
                    @click="row.isExpand = !row.isExpand" 
                    v-if="!row.isExpand" 
                    class="is-expand is-expand-position fold" 
                    :style="{'margin-right':-level*10+'px'}"></span>
                    <!-- 数字10到这里修改 -->
                <span 
                    @click="row.isExpand = !row.isExpand" 
                    v-if="row.isExpand" 
                    class="is-expand is-expand-position expand"
                    :style="{'margin-right':-level*10+'px'}"></span>
            </template>        
        </template>
    </div>
    
    <!-- 组件自身调用 -->
    <template v-if="row[childrenName].length">
        <div v-show="row.isExpand">
            <check-item
                :idName="idName"
                :childrenName="childrenName"
                :labelName="labelName"
                :isRadio="isRadio"
                :isCheckbox="isCheckbox"
                :disabled="disabled"
                v-for="(row,i) in row[childrenName]"
                :key="i"
                :row="row"
                :level="level+1"></check-item>
        </div>
    </template>

  </div>
</template>

<script>
import {
    filterTreeData,
    findComponentUpward,
    findComponentsDownward,
    findBrothersComponents
} from './assist.js'

export default {
    name: 'checkItem',
    inject: ['checkTree'],
    props: {
        row: {
            type: Object,
            default: null
        },
        level: Number,
        childrenName: String,
        idName: String,
        labelName: String,
        isRadio: Boolean,
        isCheckbox: Boolean,
        disabled: Boolean,
    },
    methods: {
        doCheck(e) {
            this.row.isChecked = e.target.checked;
            let checkTree = findComponentUpward(this,'checkTree');
            if(this.isRadio) {//单选，发送选中那行的信息，没有选中发送null，需要传入 isRadio
                if(this.row.isChecked) {
                    filterTreeData(checkTree.rebuildList,item => {
                        item[this.idName] == e.target[this.idName] ? item.isChecked = true : item.isChecked = false;
                    },this.childrenName)
                    checkTree.$emit('check',this.row);
                } else {
                    checkTree.$emit('check',null);
                }
            } else if(this.isCheckbox) {//普通多选，发送选中的所有行的id，没有选中发送[]，需要传入 isCheckbox
                let arr = [];
                filterTreeData(checkTree.rebuildList,item => {
                    if(item.isChecked) {
                        arr.push(item[this.idName]);//普通多选，把id加进数组
                    }
                },this.childrenName);
                checkTree.$emit('check',arr);                 
            } else {//树形多选，发送选中的所有行的id，没有选中发送[]，默认
                let parent = findComponentUpward(this,'checkItem');
                let children = findComponentsDownward(this,'checkItem');
                let brothers = findBrothersComponents(this,'checkItem');                
                // console.log(children);console.log(brothers)
                if(this.row.isChecked) {
                    children.map(item => {
                        item.row.isChecked = true;
                    });
                    while(parent) {
                        parent.row.isChecked = true;
                        parent = findComponentUpward(parent,'checkItem');
                    }
                } else {
                    children.map(item => {
                        item.row.isChecked = false;
                    });
                    while(parent) {
                        let isParentChecked = false;              
                        for(let item of brothers) {
                            if(item.row.isChecked) {
                                isParentChecked = true;
                                break;
                            }
                        }
                        parent.row.isChecked = isParentChecked ? true : false;
                        brothers = findBrothersComponents(parent,'checkItem',false);
                        parent = findComponentUpward(parent,'checkItem');
                    }
                }
                let arr = [];
                filterTreeData(checkTree.rebuildList,item => {
                    if(item.isChecked) {
                        arr.push(item[this.idName]);//树形多选，把id加进数组
                    }
                },this.childrenName)
                checkTree.$emit('check',arr);      
            }
        },
        showIcon(row) {
            row.isChecked = true;
            let checkTree = findComponentUpward(this,'checkTree');
            if(row.isChecked) {
                filterTreeData(checkTree.rebuildList,item => {
                    item[this.idName] == row[this.idName] ? item.isChecked = true : item.isChecked = false;
                },this.childrenName)
                checkTree.$emit('check',this.row);
            }
        }
    },
    components: {
        checkTreeSlot: () => import('./slot.js')
    }
}
</script>

<style scoped>
/* 行项目样式 */
.item {
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    /* background: #36AEFF */
}
.item>label {/* 选项名样式 */
    font-size: 16px;
    line-height: 16px;
    color: #666;
}
.item>.checked {
    color: #36AEFF;
}
.cursor {
    cursor: pointer;
}
/* 项目边框样式 */
.root-item {
    border: 1px solid #ddd;
    border-radius: 3px;
    margin: 10px 0;
}
.children-item {
    border-top: 1px solid #ddd;
    margin: 0 10px;/* 数字10到这里修改 */
}


/* 多选框自定义样式 */
input[type=checkbox] {
  width: 17px;/* 多选框大小 + 2px */
  height: 17px;
  position: relative;
  margin: 0;
  margin-right: 10px;
  margin-left: 10px;/* 数字10到这里修改 */
}
input[type=checkbox]:after {
  width: 15px;/* 多选框大小 */
  height: 15px;
  background:#fff;/* 未选中背景颜色 */
  border-radius: 3px;
  border:1px solid #ddd;/* 修改边框 */
  position: absolute;
  top: 0; 
  content: "";
}
input[type=checkbox]:checked:after {
  background-color: #36AEFF;/* 被选中背景颜色 */
}
input[type=checkbox]:checked::before {
    font-size: 16px;/* ✓的样式 */
    font-weight:600;
    color: #fff;/* ✓的颜色 */
    top: -3px;
    left: 2px;
    z-index: 1;
    content: "✓";
    position: absolute;
}

/* 展开、折叠图标 */
.is-expand-position {
    position: absolute;
    right: 15px;
    cursor: pointer;
}
.is-expand {
    width: 18px;
    height: 18px;
    /* border: 1px solid #ccc; */
    /* border-radius: 3px; */
    background: #36AEFF;
    display: inline-block;
}
.expand::after {
    width: 14px;
    height: 2px;
    background: #fff;
    top: 8px;
    left: 2px;
    content: '';
    position: absolute;
}
.fold::after {
    width: 14px;
    height: 2px;
    background: #fff;
    top: 8px;
    left: 2px;
    content: '';
    position: absolute;
}
.fold::before {
    width: 2px;
    height: 14px;
    background: #fff;
    top: 2px;
    left: 8px;
    content: '';
    position: absolute;
}
</style>