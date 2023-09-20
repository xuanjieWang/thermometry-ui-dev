<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入区域名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域类型" prop="mode">
        <el-select v-model="queryParams.mode" placeholder="请选择区域类型" clearable>
          <el-option
            v-for="dict in dict.type.the_region_mode_at"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区域索引" prop="regionIndex">
        <el-input
          v-model="queryParams.regionIndex"
          placeholder="请输入区域索引"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="更新人" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间">
        <el-date-picker
          v-model="daterangeUpdateTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['temp:region:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['temp:region:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['temp:region:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['temp:region:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="regionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="ID" align="center" prop="id" />-->
<!--     <el-table-column label="设备ID" align="center" prop="equipmentId" />-->
      <el-table-column label="设备" align="center" prop="equipmentName" />
      <el-table-column label="区域" align="center" prop="name" />
      <el-table-column label="类型" align="center" prop="mode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_region_mode_at" :value="scope.row.mode"/>
        </template>
      </el-table-column>
      <el-table-column label="区域索引" align="center" prop="regionIndex" />
      <el-table-column label="起始X轴坐标" align="center" prop="startPosX" />
      <el-table-column label="起始Y轴坐标" align="center" prop="startPosY" />
      <el-table-column label="结束X轴坐标" align="center" prop="endPosX" />
      <el-table-column label="结束X轴坐标" align="center" prop="endPosY" />
      <el-table-column label="区域宽度" align="center" prop="width" />
      <el-table-column label="区域高度" align="center" prop="height" />
      <el-table-column label="区域测温开关" align="center" prop="regionEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.regionEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="OSD开关" align="center" prop="osdEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.osdEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="游标开关" align="center" prop="cursorEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.cursorEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="本地参数开关" align="center" prop="paramEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.paramEnable"/>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['temp:region:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['temp:region:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改测温区域对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="equipmentId">
          <el-input v-model="form.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="区域类型" prop="mode">
          <el-select v-model="form.mode" placeholder="请选择区域类型">
            <el-option
              v-for="dict in dict.type.the_region_mode_at"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域索引" prop="regionIndex">
          <el-input v-model="form.regionIndex" placeholder="请输入区域索引" />
        </el-form-item>
        <el-form-item label="起始X轴坐标" prop="startPosX">
          <el-input v-model="form.startPosX" placeholder="请输入起始X轴坐标" />
        </el-form-item>
        <el-form-item label="起始Y轴坐标" prop="startPosY">
          <el-input v-model="form.startPosY" placeholder="请输入起始Y轴坐标" />
        </el-form-item>
        <el-form-item label="结束X轴坐标" prop="endPosX">
          <el-input v-model="form.endPosX" placeholder="请输入结束X轴坐标" />
        </el-form-item>
        <el-form-item label="结束X轴坐标" prop="endPosY">
          <el-input v-model="form.endPosY" placeholder="请输入结束X轴坐标" />
        </el-form-item>
        <el-form-item label="区域宽度" prop="width">
          <el-input v-model="form.width" placeholder="请输入区域宽度" />
        </el-form-item>
        <el-form-item label="区域高度" prop="height">
          <el-input v-model="form.height" placeholder="请输入区域高度" />
        </el-form-item>
        <el-form-item label="区域测温开关" prop="regionEnable">
          <el-radio-group v-model="form.regionEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="OSD开关" prop="osdEnable">
          <el-radio-group v-model="form.osdEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="游标开关" prop="cursorEnable">
          <el-radio-group v-model="form.cursorEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="本地参数开关" prop="paramEnable">
          <el-radio-group v-model="form.paramEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listRegion, getRegion, delRegion, addRegion, updateRegion } from "@/api/temp/region";

export default {
  name: "Region",
  dicts: ['the_switch_status', 'the_region_mode_at'],
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
      // 测温区域表格数据
      regionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 本地参数开关时间范围
      daterangeCreateTime: [],
      // 本地参数开关时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        equipmentId: null,
        equipmentName: null,
        name: null,
        mode: null,
        regionIndex: null,
        startPosX: null,
        startPosY: null,
        endPosX: null,
        endPosY: null,
        width: null,
        height: null,
        regionEnable: null,
        osdEnable: null,
        cursorEnable: null,
        paramEnable: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipmentId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        equipmentName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "区域名称不能为空", trigger: "blur" }
        ],
        mode: [
          { required: true, message: "区域类型不能为空", trigger: "change" }
        ],
        regionIndex: [
          { required: true, message: "区域索引不能为空", trigger: "blur" }
        ],
        startPosX: [
          { required: true, message: "起始X轴坐标不能为空", trigger: "blur" }
        ],
        startPosY: [
          { required: true, message: "起始Y轴坐标不能为空", trigger: "blur" }
        ],
        endPosX: [
          { required: true, message: "结束X轴坐标不能为空", trigger: "blur" }
        ],
        endPosY: [
          { required: true, message: "结束X轴坐标不能为空", trigger: "blur" }
        ],
        width: [
          { required: true, message: "区域宽度不能为空", trigger: "blur" }
        ],
        height: [
          { required: true, message: "区域高度不能为空", trigger: "blur" }
        ],
        regionEnable: [
          { required: true, message: "区域测温开关不能为空", trigger: "change" }
        ],
        osdEnable: [
          { required: true, message: "OSD开关不能为空", trigger: "change" }
        ],
        cursorEnable: [
          { required: true, message: "游标开关不能为空", trigger: "change" }
        ],
        paramEnable: [
          { required: true, message: "本地参数开关不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询测温区域列表 */
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
      listRegion(this.queryParams).then(response => {
        this.regionList = response.rows;
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
        equipmentId: null,
        equipmentName: null,
        name: null,
        mode: null,
        regionIndex: null,
        startPosX: null,
        startPosY: null,
        endPosX: null,
        endPosY: null,
        width: null,
        height: null,
        regionEnable: null,
        osdEnable: null,
        cursorEnable: null,
        paramEnable: null
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
      this.open = true;
      this.title = "添加测温区域";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRegion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改测温区域";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRegion(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRegion(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除测温区域编号为"' + ids + '"的数据项？').then(function() {
        return delRegion(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('temp/region/export', {
        ...this.queryParams
      }, `region_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
