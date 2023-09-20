<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24"> </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>后台管理框架</h2>
        <p>
          一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了管理系统，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。所有前端后台代码封装过后十分精简易上手，出错概率低。同时支持移动客户端访问。系统会陆续更新一些实用功能。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p></p>
        <p>> ></p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log"> </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>更新日志</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item title="v3.8.5 - 2023-01-01">
              <ol>
                <li>定时任务违规的字符</li>
                <li>重置时取消部门选中</li>
                <li>新增返回警告消息提示</li>
                <li>忽略不必要的属性数据返回</li>
                <li>修改参数键名时移除前缓存配置</li>
                <li>导入更新用户数据前校验数据权限</li>
                <li>兼容Excel下拉框内容过多无法显示的问题</li>
                <li>升级echarts到最新版本5.4.0</li>
                <li>升级core-js到最新版本3.25.3</li>
                <li>升级oshi到最新版本6.4.0</li>
                <li>升级kaptcha到最新版2.3.3</li>
                <li>升级druid到最新版本1.2.15</li>
                <li>升级fastjson到最新版2.0.20</li>
                <li>升级pagehelper到最新版1.4.6</li>
                <li>优化弹窗内容过多展示不全问题</li>
                <li>优化swagger-ui静态资源使用缓存</li>
                <li>开启TopNav没有子菜单隐藏侧边栏</li>
                <li>删除fuse无效选项maxPatternLength</li>
                <li>优化导出对象的子列表为空会出现[]问题</li>
                <li>优化编辑头像时透明部分会变成黑色问题</li>
                <li>优化小屏幕上修改头像界面布局错位的问题</li>
                <li>修复代码生成勾选属性无效问题</li>
                <li>修复文件上传组件格式验证问题</li>
                <li>修复回显数据字典数组异常问题</li>
                <li>修复sheet超出最大行数异常问题</li>
                <li>修复Log注解GET请求记录不到参数问题</li>
                <li>修复调度日志点击多次数据不变化的问题</li>
                <li>修复主题颜色在Drawer组件不会加载问题</li>
                <li>修复文件名包含特殊字符的文件无法下载问题</li>
                <li>修复table中更多按钮切换主题色未生效修复问题</li>
                <li>修复某些特性的环境生成代码变乱码TXT文件问题</li>
                <li>修复代码生成图片/文件/单选时选择必填无法校验问题</li>
                <li>
                  修复某些特性的情况用户编辑对话框中角色和部门无法修改问题
                </li>
                <li>其他细节优化</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log"> </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.5",
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
