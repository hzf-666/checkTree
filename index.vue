<template>
    <div
        class="tree"
        :style="{
            'width': width,
            'height': height
        }">
        <template v-if="list.length">
            <check-item
                :childrenName="childrenName"
                :idName="idName"
                :labelName="labelName"
                :isRadio="isRadio"
                :isCheckbox="isCheckbox"
                :disabled="disabled"
                v-for="(row,i) in rebuildList"
                :key="i"
                :row="row"
                :level="0">
            </check-item>
        </template>
        <template v-else>
            <div class="footer">
                暂无数据
            </div>
        </template>

    </div>
</template>

<script>
import {
    filterTreeData
} from './assist.js'

export default {
    name: 'checkTree',
    provide() {
        return {
            checkTree: this
        }
    },
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        },
        initList: {
            type: Array,
            default() {
                return [];
            }
        },
        childrenName: {
            type: String,
            default: 'children'
        },
        idName: {
            type: String,
            default: 'id'
        },
        labelName: {
            type: String,
            default: 'name'
        },
        isRadio: {
            type: Boolean,
            default: false
        },
        isCheckbox: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: 'auto'
        },
        height: {
            type: String,
            default: 'auto'
        }
    },
    data() {
        return {
            rebuildList: []
        };
    },
    watch: {
        list: {
            handler: function(n,o) {
                let tmp = JSON.parse(JSON.stringify(n));
                filterTreeData(tmp,item => {
                    item[this.childrenName] = item[this.childrenName] || [];
                    item.isExpand = item.isExpand || false;
                    this.initList.includes(item[this.idName]) ? item.isChecked = true : item.isChecked = false;
                },this.childrenName);
                this.rebuildList = tmp;
            },
            deep: true,
            immediate: true
        },
        initList: {
            handler: function(n,o) {
                filterTreeData(this.rebuildList,item => {
                    n.includes(item[this.idName]) ? item.isChecked = true : item.isChecked = false;
                },this.childrenName)
            },
            deep: true
        }
    },
    methods: {
        
    },
    components: {
        checkItem: () => import('./checkItem.vue')
    }
}
</script>

<style scoped>
.tree {
    overflow-y: auto;
    user-select: none;
    /* border: 1px solid #ddd; */
}
.footer {
    height: 50px;
    color: #36AEFF;
    border: 1px solid #ddd;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
}

::-webkit-scrollbar {/* 滚动条滑块大小 */
    width: 5px;
    height: 5px;
}
::-webkit-scrollbar-track-piece {/* 滚动条滑块样式 */
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    -webkit-border-radius: 6px;
}
::-webkit-scrollbar-thumb:vertical {/* 水平滚动条轨道样式 */
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    border-radius: 6px;
    -webkit-border-radius: 6px;
}
::-webkit-scrollbar-thumb:horizontal {/* 垂直滚动条轨道样式 */
    width: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    border-radius: 6px;
    -webkit-border-radius: 6px;
}
</style>