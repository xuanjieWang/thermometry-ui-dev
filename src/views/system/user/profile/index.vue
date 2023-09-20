<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <el-form :model="user" class="elForm">
              <el-form-item label="用户名称:" style="margin-left: 30px">
                <span style="margin-right: 150px">{{ user.userName }}</span>
              </el-form-item>
              <el-form-item label="手机号码:" style="margin-left: 30px">
                <span style="margin-right: 100px">{{ user.phonenumber }}</span>
              </el-form-item>
              <el-form-item label="用户邮箱:" style="margin-left: 30px">
                <span style="margin-right: 100px">{{ user.email }}</span>
              </el-form-item>
              <el-form-item label="所属部门:" style="margin-left: 30px">
                <span v-if="user.dept" style="margin-right: 130px">{{ user.dept.deptName }}</span>
              </el-form-item>
              <el-form-item label="所属角色:" style="margin-left: 30px">
              <span style="margin-right: 120px">{{ roleGroup }}</span>
            </el-form-item>
              <el-form-item label="创建日期:" style="margin-left: 30px">
                <span style="margin-right: 55px">{{ user.createTime }}</span>
              </el-form-item>
            </el-form>

<!--            <ul class="list-group list-group-striped">-->
<!--              -->
<!--              <li class="list-group-item">-->
<!--                <svg-icon icon-class="user" />用户名称-->
<!--                <div class="pull-right">{{ user.userName }}</div>-->
<!--              </li>-->
<!--              <li class="list-group-item">-->
<!--                <svg-icon icon-class="phone" />手机号码-->
<!--                <div class="pull-right">{{ user.phonenumber }}</div>-->
<!--              </li>-->
<!--              <li class="list-group-item">-->
<!--                <svg-icon icon-class="email" />用户邮箱-->
<!--                <div class="pull-right">{{ user.email }}</div>-->
<!--              </li>-->
<!--              <li class="list-group-item">-->
<!--                <svg-icon icon-class="tree" />所属部门-->
<!--                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>-->
<!--              </li>-->
<!--              <li class="list-group-item">-->
<!--                <svg-icon icon-class="peoples" />所属角色-->
<!--                <div class="pull-right">{{ roleGroup }}</div>-->
<!--              </li>-->
<!--              <li class="list-group-item">-->
<!--                <svg-icon icon-class="date" />创建日期-->
<!--                <div class="pull-right">{{ user.createTime }}</div>-->
<!--              </li>-->
<!--            </ul>-->
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>

<style>
  .el-card {
    border-radius: 4px;
    border: 1px solid #1f2124;
    background-color: #1f2124;
    overflow: hidden;
    color: #dadada;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #1f2124;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #1f2124;
    color: #dadada;
  }

  .el-card__body {
    padding: 5px 5px 5px 5px;
    background: #1f2124;
    color: #dadada;
  }
  .elForm {
    color: #dadada;
  }

  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #dadada;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-input__inner {
    -webkit-appearance: none;
    background-color: #303133;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #303133;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #dadada;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
  .el-input__inner:focus {
    border: 1px solid #5e6493;
  }

  .el-input__inner:hover {
    border: 1px solid #5e6493;
  }

  .el-radio {
    color: #dadada;

  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #5e6493;
    background: #5e6493;
  }

  .el-radio__input.is-checked + .el-radio__label {
    color: #5e6493;
  }

  .el-radio__label {
    padding-left: 10px;
    font-weight: 550;
    font-size: 1em;
  }

  .el-button {
    color: #dadada !important;
    background-color: #303133 !important;
    border-color: #303133 !important;
    font-weight: 700;
    font-size: .85em;
  }

  .el-tabs__item.is-active {
    color: #5e6493;
  }
  .el-tabs__active-bar {
    background-color : #5e6493;
  }

  .el-tabs__item {
    color: #dadada;
    font-weight: 550;
    font-size: 1em;
  }
  .el-tabs__item:hover {
    border-color: #1f2124;
    color: #5e6493
  }
</style>

<style>
  .el-card {
    border-radius: 4px;
    border: 1px solid #1f2124;
    background-color: #1f2124;
    overflow: hidden;
    color: #dadada;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #1f2124;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #1f2124;
    color: #dadada;
  }

  .el-card__body {
    padding: 5px 5px 5px 5px;
    background: #1f2124;
    color: #dadada;
  }
  .elForm {
    color: #dadada;
  }

  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #dadada;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-input__inner {
    -webkit-appearance: none;
    background-color: #303133;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #303133;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #dadada;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
  .el-input__inner:focus {
    border: 1px solid #5e6493;
  }

  .el-input__inner:hover {
    border: 1px solid #5e6493;
  }

  .el-radio {
    color: #dadada;

  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #5e6493;
    background: #5e6493;
  }

  .el-radio__input.is-checked + .el-radio__label {
    color: #5e6493;
  }

  .el-radio__label {
    padding-left: 10px;
    font-weight: 550;
    font-size: 1em;
  }

  .el-button {
    color: #dadada !important;
    background-color: #303133 !important;
    border-color: #303133 !important;
    font-weight: 700;
    font-size: .85em;
  }

  .el-tabs__item.is-active {
    color: #5e6493;
  }
  .el-tabs__active-bar {
    background-color : #5e6493;
  }

  .el-tabs__item {
    color: #dadada;
    font-weight: 550;
    font-size: 1em;
  }
  .el-tabs__item:hover {
    border-color: #1f2124;
    color: #5e6493
  }
</style>
