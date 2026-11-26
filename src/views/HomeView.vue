<template>
  <div class="home">
    <div class="centerBox">
      <!-- 头像 -->
      <el-avatar
          src="/icon.jpg"
          :size="150"
          class="picT"
        ></el-avatar>
      <!-- 作者姓名 -->
      <div class="ahtuorName">xxy</div>
      <el-divider class="divider"></el-divider>
      <!-- 内容 -->
      <div class="title" v-for="(v, k) in content" :key="k">
        <typewriter class="str" :str="v"></typewriter>
      </div>
      <!-- 引导按钮 -->
      <div class="btnBox">
        <el-button round @click="clickHome" class="btnStyle">首页</el-button>
        <el-button round @click="clickProject" class="btnStyle">项目笔记</el-button>
        <el-button round @click="clickStudy" class="btnStyle">学习笔记</el-button>
      </div>
    </div>
  </div>
</template>


<script>
// import Popup from "@/components/dialogView/index.vue"; //弹窗组件
import typewriter from "@/components/typewriter.vue";
import "@/css/HomeView.scss";

export default {
  name: "HomeView",
  components: { typewriter },
  data() {
    return {
      content: [],
      str: "我是文字",
      //文章内容
      words: [
        "一个记录乱七八糟的地方",
        "记录下工作上学到的东西",
      ],
      dialogVisible: false, // 弹框的出现与否
      dialogTitle: "GitHub", //弹窗标题
    };
  },
  mounted() {
    this.setTime();
  },
  methods: {
    setTime() {
      var arr = this.words;
      var that = this;
      arr.forEach(function (v, k) {
        setTimeout(function () {
          that.content.push(v);
        }, k * 2500);
      });
    },
    clickHome() {
      this.$router.push("/");
    },
    clickProject() {
      this.$router.push("/project");
    },
    clickStudy() {
      this.$router.push("/study");
    },
  },
};
</script>