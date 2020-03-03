export default {
    name: 'checkTreeSlot',
    functional: true,
    props: {
        slotType: String,
        row: Object,
    },
    inject: ['checkTree'],
    render: (h,ctx) => {
        return h('span', {
            on: {
                click() {
                    if(ctx.props.slotType == 'expandIcon' || ctx.props.slotType == 'foldIcon') {
                        ctx.props.row.isExpand = !ctx.props.row.isExpand;
                    }
                }
            }
        }, ctx.injections.checkTree.$scopedSlots[ctx.props.slotType]({
            row: ctx.props.row
        }));
    }
}