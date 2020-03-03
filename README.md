### 使用方法
    ...
        将文件放进comoponents文件夹中
        在需要使用的地方注册该组件，如：
        components: {
            checkTree: () => import('@/components/checkTree') <!-- /index.vue 可以不加，vue会自动寻找目录里的index文件 -->
        }

        组件中使用：
        <check-tree
            :list = "list"  向组件传递一个对象数组 list
            :initList = "initList"  向组件传递一个id数组 initList，数组元素为 list 元素中的 id，初始化选中的选项，默认全部不选中
            @chek = "handleCheck"  选择时触发，返回一个参数，单选时返回选中当前行的数据（一个对象，未选中为null），多选时返回选中选项的id数组（未选中为[]）
            :childrenName = "children"  传递list中 children 的key值，默认为children
            :idName = "id"  传递list中 id 的key值，默认为id
            :labelName = "name"  传递list中 要显示的选项名 的key值，默认为name
            isRadio  是否开启单选模式，不填写就不开启，默认为树形多选
            isCheckbox  是否开启普通多选模式，不填写就不开启，默认为树形多选，isRadio 和 isCheckbox 同时填写默认为isRadio
            disabled    是否为不可选状态，不填写就不开启
            width = "100px"    该组件的宽度，默认为auto
            height = "100px"    该组件的高度，默认为auto
        >

            三种slot类型：
            1.可以将多选框替换为自定义图标，一旦选择此slot，自动变为单选，且无法取消选中的选项
            <template #checkedIcon> <!-- #checkedIcon="{row}" row为当前行的数据 -->
                <i></i>
            </template>
            2.点击展开图标的slot
            <template #expandIcon> <!-- #expandIcon="{row}" row为当前行的数据 -->
                <i></i>
            </template>            
            3.点击折叠图标的slot
            <template #foldIcon> <!-- #foldIcon="{row}" row为当前行的数据 -->
                <i></i>
            </template>            


        <check-tree>

    ...
