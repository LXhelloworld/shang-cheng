<template>
    <div>
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
        <div class="md-modal-inner">
          <div class="md-top">
            <button class="md-close" @click="closeModal">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="md-overlay"   v-if="mdShow==true" @click="closeModal"></div>
    </div>
</template>

<script>
  import './../assets/css/product.css'
  import './../assets/css/base.css'
  import './../assets/css/login.css'
    export default {
      props:["mdShow"],
      name: "modal",
      methods:{
        closeModal(){
          this.$emit("close");
        }
      }
    }
</script>

<style scoped>

</style>
