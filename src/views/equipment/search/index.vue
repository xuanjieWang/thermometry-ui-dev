<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:data:search']"
        >搜索</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:data:remove']"
        >添加</el-button>
      </el-col>
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="ID" align="center" prop="id" />-->
<!--    <el-table-column label="所属分组ID" align="center" prop="groupId" />-->
      <el-table-column label="分组" align="center" prop="groupName" />
      <el-table-column label="设备名称" align="center" prop="name" />
      <el-table-column label="网络状态" align="center" prop="netStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_equipment_net_status" :value="scope.row.netStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="设备型号 " align="center" prop="type" />
      <el-table-column label="信道" align="center" prop="channel" />
      <el-table-column label="设备IP地址" align="center" prop="ip" />
      <el-table-column label="端口" align="center" prop="port" />
      <el-table-column label="设备SN码" align="center" prop="sn" />
      <el-table-column label="设备PN码" align="center" prop="pn" />
      <el-table-column label="设备类别" align="center" prop="category">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_equipment_category" :value="scope.row.category"/>
        </template>
      </el-table-column>
      <el-table-column label="登录设备用户名" align="center" prop="username" />
      <el-table-column label="登录设备密码" align="center" prop="password" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:data:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:data:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分组" prop="groupId">
          <treeselect v-model="form.groupId"  :options="groupOptions" :normalizer="normalizer" @select="selectTree"  placeholder="请选择父分组ID" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="网络状态" prop="netStatus">
          <el-radio-group v-model="form.netStatus">
            <el-radio
              v-for="dict in dict.type.the_equipment_net_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备型号 " prop="type">
          <el-input v-model="form.type" placeholder="请输入设备型号 " />
        </el-form-item>
        <el-form-item label="信道" prop="channel">
          <el-input v-model="form.channel" placeholder="请输入信道" />
        </el-form-item>
        <el-form-item label="设备IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入设备IP地址" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="设备SN码" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入设备SN码" />
        </el-form-item>
        <el-form-item label="设备PN码" prop="pn">
          <el-input v-model="form.pn" placeholder="请输入设备PN码" />
        </el-form-item>
        <el-form-item label="设备类别" prop="category">
          <el-radio-group v-model="form.category">
            <el-radio
              v-for="dict in dict.type.the_equipment_category"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="登录设备用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入登录设备用户名" />
        </el-form-item>
        <el-form-item label="登录设备密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入登录设备密码" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listData, getData, delData, addData, updateData } from "@/api/equipment/data";
import {listGroup} from "@/api/equipment/group";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Data",
  components: {
    Treeselect
  },
  dicts: ['the_equipment_category', 'the_equipment_net_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备数据表格数据
      dataList: [],
      // 设备分组树选项
      groupOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 登录设备密码时间范围
      daterangeCreateTime: [],
      // 登录设备密码时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        groupId: null,
        groupName: null,
        name: null,
        netStatus: null,
        type: null,
        channel: null,
        ip: null,
        port: null,
        sn: null,
        pn: null,
        category: null,
        username: null,
        password: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        groupId: [
          { required: true, message: "所属分组不能为空", trigger: "change" },
          {
            pattern: /^[1-9]\d*$/,
            message: "不能为顶级节点",
            trigger: "change"
          }
        ],
        groupName: [
          { required: true, message: "所属分组名称不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        ip: [
          { required: true, message: "设备IP地址不能为空", trigger: "blur" }
        ],
        port: [
          { required: true, message: "端口不能为空", trigger: "blur" }
        ],
        category: [
          { required: true, message: "设备类别不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 选中树节点*/
    selectTree(node){
      this.form.groupId = node.id;
      this.form.groupName = node.groupName;
    },
    /** 转换设备分组数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.groupName,
        children: node.children
      };
    },
    /** 查询设备分组下拉树结构 */
    getTreeselect() {
      listGroup().then(response => {
        this.groupOptions = [];
        const data = { id: 0, groupName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.groupOptions.push(data);
      });
    },
    /** 查询设备数据列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
        this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
        this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
      }
      listData(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        groupId: null,
        groupName: null,
        name: null,
        netStatus: null,
        type: null,
        channel: null,
        ip: null,
        port: null,
        sn: null,
        pn: null,
        category: null,
        username: null,
        password: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.daterangeUpdateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加设备数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id || this.ids
      getData(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateData(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addData(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除设备数据编号为"' + ids + '"的数据项？').then(function() {
        return delData(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipment/data/export', {
        ...this.queryParams
      }, `data_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
