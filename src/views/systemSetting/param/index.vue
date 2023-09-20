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
          v-hasPermi="['systemSetting:param:add']"
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
          v-hasPermi="['systemSetting:param:edit']"
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
          v-hasPermi="['systemSetting:param:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['systemSetting:param:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paramList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="ID" align="center" prop="id" />-->
<!--       <el-table-column label="设备ID" align="center" prop="equipmentId" />-->
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="OSD叠加总开关" align="center" prop="osdEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.osdEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="温度OSD开关" align="center" prop="osdTemp">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.osdTemp"/>
        </template>
      </el-table-column>
      <el-table-column label="环境参数OSD开关" align="center" prop="osdEnvir">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.osdEnvir"/>
        </template>
      </el-table-column>
      <el-table-column label="伪彩条OSD开关" align="center" prop="osdPseudo">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.osdPseudo"/>
        </template>
      </el-table-column>
      <el-table-column label="最高最低温游标OSD开关" align="center" prop="osdMaxMinCursor">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.osdMaxMinCursor"/>
        </template>
      </el-table-column>
      <el-table-column label="自定义osd显示位置" align="center" prop="format" />
      <el-table-column label="时间格式" align="center" prop="timeFormat">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_osd_time_format" :value="scope.row.timeFormat"/>
        </template>
      </el-table-column>
      <el-table-column label="否显示自定义osd字符" align="center" prop="customStrShow">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.customStrShow"/>
        </template>
      </el-table-column>
      <el-table-column label="自定义osd索引" align="center" prop="customIndex" />
      <el-table-column label="自定义osd字符串" align="center" prop="customStr" />
      <el-table-column label="自定义osd字符串显示宽度" align="center" prop="customStrWidth" />
      <el-table-column label="区域数组宽度" align="center" prop="deviceWidth" />
      <el-table-column label="区域数组高度" align="center" prop="deviceHeight" />
      <el-table-column label="时间X轴坐标" align="center" prop="timePosX" />
      <el-table-column label="时间Y轴坐标" align="center" prop="timePosY" />
      <el-table-column label="自定义osd字符串X轴坐标" align="center" prop="customStrPosX" />
      <el-table-column label="自定义osd字符串Y轴坐标" align="center" prop="customStrPosY" />
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
            v-hasPermi="['systemSetting:param:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['systemSetting:param:remove']"
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

    <!-- 添加或修改系统参数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="equipmentId">
          <el-input v-model="form.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="OSD叠加总开关" prop="osdEnable">
          <el-radio-group v-model="form.osdEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="温度OSD开关" prop="osdTemp">
          <el-radio-group v-model="form.osdTemp">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="环境参数OSD开关" prop="osdEnvir">
          <el-radio-group v-model="form.osdEnvir">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="伪彩条OSD开关" prop="osdPseudo">
          <el-radio-group v-model="form.osdPseudo">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最高最低温游标OSD开关" prop="osdMaxMinCursor">
          <el-radio-group v-model="form.osdMaxMinCursor">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义osd显示位置" prop="format">
          <el-input v-model="form.format" placeholder="请输入自定义osd显示位置" />
        </el-form-item>
        <el-form-item label="时间格式" prop="timeFormat">
          <el-select v-model="form.timeFormat" placeholder="请选择时间格式">
            <el-option
              v-for="dict in dict.type.the_osd_time_format"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="否显示自定义osd字符" prop="customStrShow">
          <el-radio-group v-model="form.customStrShow">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义osd索引" prop="customIndex">
          <el-input v-model="form.customIndex" placeholder="请输入自定义osd索引" />
        </el-form-item>
        <el-form-item label="自定义osd字符串" prop="customStr">
          <el-input v-model="form.customStr" placeholder="请输入自定义osd字符串" />
        </el-form-item>
        <el-form-item label="自定义osd字符串显示宽度" prop="customStrWidth">
          <el-input v-model="form.customStrWidth" placeholder="请输入自定义osd字符串显示宽度" />
        </el-form-item>
        <el-form-item label="区域数组宽度" prop="deviceWidth">
          <el-input v-model="form.deviceWidth" placeholder="请输入区域数组宽度" />
        </el-form-item>
        <el-form-item label="区域数组高度" prop="deviceHeight">
          <el-input v-model="form.deviceHeight" placeholder="请输入区域数组高度" />
        </el-form-item>
        <el-form-item label="时间X轴坐标" prop="timePosX">
          <el-input v-model="form.timePosX" placeholder="请输入时间X轴坐标" />
        </el-form-item>
        <el-form-item label="时间Y轴坐标" prop="timePosY">
          <el-input v-model="form.timePosY" placeholder="请输入时间Y轴坐标" />
        </el-form-item>
        <el-form-item label="自定义osd字符串X轴坐标" prop="customStrPosX">
          <el-input v-model="form.customStrPosX" placeholder="请输入自定义osd字符串X轴坐标" />
        </el-form-item>
        <el-form-item label="自定义osd字符串Y轴坐标" prop="customStrPosY">
          <el-input v-model="form.customStrPosY" placeholder="请输入自定义osd字符串Y轴坐标" />
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
import { listParam, getParam, delParam, addParam, updateParam } from "@/api/systemSetting/param";

export default {
  name: "Param",
  dicts: ['the_osd_time_format', 'the_switch_status'],
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
      // 系统参数表格数据
      paramList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 自定义osd字符串Y轴坐标时间范围
      daterangeCreateTime: [],
      // 自定义osd字符串Y轴坐标时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        equipmentName: null
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
        osdEnable: [
          { required: true, message: "OSD叠加总开关不能为空", trigger: "change" }
        ],
        osdTemp: [
          { required: true, message: "温度OSD开关不能为空", trigger: "change" }
        ],
        osdEnvir: [
          { required: true, message: "环境参数OSD开关不能为空", trigger: "change" }
        ],
        osdPseudo: [
          { required: true, message: "伪彩条OSD开关不能为空", trigger: "change" }
        ],
        osdMaxMinCursor: [
          { required: true, message: "最高最低温游标OSD开关不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统参数列表 */
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
      listParam(this.queryParams).then(response => {
        this.paramList = response.rows;
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
        osdEnable: null,
        osdTemp: null,
        osdEnvir: null,
        osdPseudo: null,
        osdMaxMinCursor: null,
        format: null,
        timeFormat: null,
        customStrShow: null,
        customIndex: null,
        customStr: null,
        customStrWidth: null,
        deviceWidth: null,
        deviceHeight: null,
        timePosX: null,
        timePosY: null,
        customStrPosX: null,
        customStrPosY: null
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
      this.title = "添加系统参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getParam(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统参数";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateParam(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addParam(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除系统参数编号为"' + ids + '"的数据项？').then(function() {
        return delParam(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('systemSetting/param/export', {
        ...this.queryParams
      }, `param_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
