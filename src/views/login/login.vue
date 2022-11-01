<template>
  <el-container class="contain">
    <el-main>
      <img src="../../assets/images/图片3.png" alt="" width="80%">
      <div class="formDiv">
        <div class="inputDiv">
          <div class="elinput">
            <i class="el-icon-user"></i>
            <el-input v-model="form.useremail" placeholder="请输入用户名"></el-input>
          </div>
          <div class="elinput">
            <i class="el-icon-key"></i>
            <el-input v-model="form.userpwd" placeholder="请输入密码"></el-input>
          </div>
        </div>
        <el-button class="loginBtn"  @click="login">登录</el-button>
        <el-button class="registerBtn"  @click="register">注册</el-button>
      </div>
      <el-dialog title="用户注册" width="80%" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.reuseremail" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" style="margin: 0">
            <el-input v-model="form.reuserpwd" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="startRegister">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        username: "",
        useremail: "",
        userpwd: "",
        reusername: "",
        reuseremail: "",
        reuserpwd: "",
      },
      dialogFormVisible: false,
      formLabelWidth: '60px'
    }
  },
  methods:{
    // 登录
    async login() {
      const _this = this;
      if (this.form.useremail !== "" && this.form.userpwd !== "") {
        const { data: res } = await this.$http.post("/login", {
          email: this.form.useremail,
          password: this.form.userpwd,
        });
        window.sessionStorage.setItem('token','success')
        if (res.meta.status === 403) {
          alert(res.meta.msg);
        } else {
          alert("登录成功！");
         await _this.$router.push({
           name: 'index',
         })
        }
      } else {
        alert("登录内容不能留空！");
      }
    },
    register () {
      this.dialogFormVisible = true;
    },
    async startRegister(){
      if (
        this.form.reuseremail !== "" &&
        this.form.reuserpwd !== ""
      ) {
        // console.log("11222");
        const { data: res } = await this.$http.post("/register", {
          username: this.form.reuseremail,
          email: this.form.reuseremail,
          password: this.form.reuserpwd,
        });
        // console.log(res);
        if (res.meta.status === 403) {
          alert(res.meta.msg);
        } else {
          alert("注册成功！");
          this.dialogFormVisible= false;
        }
      } else {
        alert("注册内容不能留空！");
      }
    }
  }
}
</script>

<style scoped lang="scss">
.contain {
  width: 100vw;
  height: 50vh;
  background-image: url("../../assets/images/bg.png");
  background-size: cover;
  background-position: center center;
  text-align: center;

  /deep/ .el-main {
    padding: 0;
    img {
      opacity: 0.8;
      z-index: 0;
      position: relative;
      top: 30px;
      width: 80%;
    }

    .formDiv {
      position: absolute;
      top: 40%;
      width: 100%;
      height: 500px;
    }

    .inputDiv {
      width: 80%;
      height: auto;
      margin: 0 auto;
      padding: 20px 20px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0px 4px 4px 0px #e5e5e5;
      .elinput {
        margin-bottom: 10px;
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #ccc;

        i {
          float: left;
          width: 40px;
          height: 40px;
          line-height: 40px;
          color: #386dda;
          font-size: 20px;
        }
        .el-input {
          width: 84%;
          float: left;
          .el-input__inner {
            border: none;
            padding: 0;
            height: 40px;
            background: none;
          }
        }

      }
    }



    .loginBtn {
      background: linear-gradient(to bottom right, #65c1ff, #3861d3);
      color: #fff;
      width: 90%;
      border-radius: 10px;
      margin-top: 40px;
    }
    .registerBtn {
      background: linear-gradient(to bottom right, #ffffff, #d2d2d2);
      width: 90%;
      border-radius: 10px;
      margin-top: 10px;
      margin-left: 0;
      color: #4c8be6;
    }
  }

  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 5px 10px;
    }
    .el-input {
      height: 40px;
      .el-input__inner {
        padding: 0;
        height: 40px;
      }
    }
  }
}
</style>
