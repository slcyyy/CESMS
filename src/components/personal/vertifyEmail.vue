<template>
  <div>
    <h1 >邮箱{{codeEmail}}已绑定</h1>                                       
  </div>
</template>

<script>
export default {
  data(){
    return{
      email:'631674132@qq.com'
    }
  },
  computed:{
    codeEmail(){
      let temp = [...this.email]
      this.email=""
      temp.map((res,index)=>{
        if(index>1 && index<5){
          this.email+="*"
        }
        else{
          this.email+=res
        }
      })
      return this.email
    }
  }
}
</script>

<style>

</style>