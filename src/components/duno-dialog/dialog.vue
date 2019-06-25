<template>
  <el-dialog
   :title="title" :visible.sync="isShow"
   :lock-scroll="lockScroll" :custom-class="customClass"
   :before-close="beforeClose" :center="center"
   :width="width" :top="top" :modal="modal" :fullscreen="fullscreen"
   :modal-append-to-body="modalAppendToBody" :append-to-body="appendToBody"
   :close-on-press-escape="!loading" :show-close="!loading" :close-on-click-modal="!loading"
  >
    <slot></slot>
    <div v-if="isShowFooter" slot="footer" class="dialog-footer" >
      <el-button type="primary" :loading="loading" @click="$emit('onConfirm')">{{ confirmText }}</el-button>
      <el-button @click="$emit('onCancel')" :disabled="loading">{{ cancelText }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'progressTep',
  components: {},
  data () {
    return {
      isShow: false
    }
  },
  props: {
    /* 弹框名称 */
    title: {
      type: String,
      default: '弹窗'
    },
    /* 是否加载中 */
    loading: {
      type: Boolean,
      default: false
    },
    /* 弹框是否显示 */
    showDialog: {
      type: Boolean,
      default: false
    },
    /* 是否显示弹框底部 */
    isShowFooter: {
      type: Boolean,
      default: true
    },
    /* 确定按钮的文字 */
    confirmText: {
      type: String,
      default: () => {
        return '确 定'
      }
    },
    /* 取消按钮的文字 */
    cancelText: {
      type: String,
      default: () => {
        return '取 消'
      }
    },
    width: String,
    top: String,
    fullscreen: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    modal: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    modalAppendToBody: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    appendToBody: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    lockScroll: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    center: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    customClass: String,
    beforeClose: Function
  },
  computed: {},
  watch: {
    isShow(now) {
      if (!now) {
        this.$emit('onCancel')
      }
    },
    showDialog (now) {
      this.isShow = now
    }
  },
  methods: {},
  mounted () {
    const that = this
    that.isShow = that.showDialog
  }
}
</script>