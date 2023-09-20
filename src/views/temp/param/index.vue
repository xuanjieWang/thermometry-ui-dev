<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入参数名称"
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
          v-hasPermi="['temp:param:add']"
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
          v-hasPermi="['temp:param:edit']"
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
          v-hasPermi="['temp:param:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['temp:param:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paramList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="ID" align="center" prop="id" />-->
<!--      <el-table-column label="设备ID" align="center" prop="equipmentId" />-->
      <el-table-column label="设备" align="center" prop="equipmentName" />
      <el-table-column label="参数名称" align="center" prop="name" />
      <el-table-column label="温度单位" align="center" prop="tempUnit">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_temp_unit" :value="scope.row.tempUnit"/>
        </template>
      </el-table-column>
      <el-table-column label="温宽拉伸开关" align="center" prop="tempRangeSwitch">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.tempRangeSwitch"/>
        </template>
      </el-table-column>
      <el-table-column label="温宽拉伸低温阈值" align="center" prop="tempRangeLowThreshold" />
      <el-table-column label="温宽拉伸高温阈值" align="center" prop="tempRangeHighThreshold" />
      <el-table-column label="面阵宽度" align="center" prop="imageWidth" />
      <el-table-column label="面阵高度" align="center" prop="imageHeight" />
      <el-table-column label="温度成像开关状态" align="center" prop="tempImageSwitch">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.tempImageSwitch"/>
        </template>
      </el-table-column>
      <el-table-column label="发射率" align="center" prop="emissivity" />
      <el-table-column label="湿度" align="center" prop="humidity" />
      <el-table-column label="反射温度(单位℃)" align="center" prop="reflectTemp" />
      <el-table-column label="环境温度(单位℃)" align="center" prop="airTemp" />
      <el-table-column label="距离(单位M)" align="center" prop="distance" />
      <el-table-column label="定时抓拍间隔时间" align="center" prop="captureTime" />
      <el-table-column label="抓拍格式" align="center" prop="captureFormat">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_capture_format" :value="scope.row.captureFormat"/>
        </template>
      </el-table-column>
      <el-table-column label="伪彩类型" align="center" prop="colorPlate">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_color_plate" :value="scope.row.colorPlate"/>
        </template>
      </el-table-column>
      <el-table-column label="帧频" align="center" prop="imageFramerate" />
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
            v-hasPermi="['temp:param:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['temp:param:remove']"
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

    <!-- 添加或修改测温参数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="equipmentId">
          <el-input v-model="form.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="温度单位" prop="tempUnit">
          <el-select v-model="form.tempUnit" placeholder="请选择温度单位">
            <el-option
              v-for="dict in dict.type.the_temp_unit"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面阵宽度" prop="imageWidth">
          <el-input v-model="form.imageWidth" placeholder="请输入面阵宽度" />
        </el-form-item>
        <el-form-item label="面阵高度" prop="imageHeight">
          <el-input v-model="form.imageHeight" placeholder="请输入面阵高度" />
        </el-form-item>
        <el-form-item label="温宽拉伸开关" prop="tempRangeSwitch">
          <el-radio-group v-model="form.tempRangeSwitch">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="温宽拉伸低温阈值" prop="tempRangeLowThreshold">
          <el-input v-model="form.tempRangeLowThreshold" placeholder="请输入温宽拉伸低温阈值" />
        </el-form-item>
        <el-form-item label="温宽拉伸高温阈值" prop="tempRangeHighThreshold">
          <el-input v-model="form.tempRangeHighThreshold" placeholder="请输入温宽拉伸高温阈值" />
        </el-form-item>
        <el-form-item label="温度成像开关状态" prop="tempImageSwitch">
          <el-radio-group v-model="form.tempImageSwitch">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发射率" prop="emissivity">
          <el-input v-model="form.emissivity" placeholder="请输入发射率" />
        </el-form-item>
        <el-form-item label="湿度" prop="humidity">
          <el-input v-model="form.humidity" placeholder="请输入湿度" />
        </el-form-item>
        <el-form-item label="反射温度(单位℃)" prop="reflectTemp">
          <el-input v-model="form.reflectTemp" placeholder="请输入反射温度(单位℃)" />
        </el-form-item>
        <el-form-item label="环境温度(单位℃)" prop="airTemp">
          <el-input v-model="form.airTemp" placeholder="请输入环境温度(单位℃)" />
        </el-form-item>
        <el-form-item label="距离(单位M)" prop="distance">
          <el-input v-model="form.distance" placeholder="请输入距离(单位M)" />
        </el-form-item>
        <el-form-item label="定时抓拍间隔时间" prop="captureTime">
          <el-input v-model="form.captureTime" placeholder="请输入定时抓拍间隔时间" />
        </el-form-item>
        <el-form-item label="抓拍格式" prop="captureFormat">
          <el-select v-model="form.captureFormat" placeholder="请选择抓拍格式">
            <el-option
              v-for="dict in dict.type.the_capture_format"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="伪彩类型" prop="colorPlate">
          <el-select v-model="form.colorPlate" placeholder="请选择伪彩类型">
            <el-option
              v-for="dict in dict.type.the_color_plate"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帧频" prop="imageFramerate">
          <el-input v-model="form.imageFramerate" placeholder="请输入帧频" />
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
import { listParam, getParam, delParam, addParam, updateParam } from "@/api/temp/param";

export default {
  name: "Param",
  dicts: ['the_temp_unit', 'the_switch_status','the_capture_format', 'the_color_plate'],
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
      // 测温参数表格数据
      paramList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 距离(单位M)时间范围
      daterangeCreateTime: [],
      // 距离(单位M)时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        equipmentName: null,
        name: null
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
        tempUnit: [
          { required: true, message: "温度单位不能为空", trigger: "change" }
        ],
        imageWidth: [
          { required: true, message: "面阵宽度不能为空", trigger: "blur" }
        ],
        imageHeight: [
          { required: true, message: "面阵高度不能为空", trigger: "blur" }
        ],
        tempRangeSwitch: [
          { required: true, message: "温宽拉伸开关不能为空", trigger: "change" }
        ],
        tempRangeLowThreshold: [
          { required: true, message: "温宽拉伸低温阈值不能为空", trigger: "blur" }
        ],
        tempRangeHighThreshold: [
          { required: true, message: "温宽拉伸高温阈值不能为空", trigger: "blur" }
        ],
        tempImageSwitch: [
          { required: true, message: "温度成像开关状态不能为空", trigger: "change" }
        ],
        emissivity: [
          { required: true, message: "发射率不能为空", trigger: "blur" }
        ],
        humidity: [
          { required: true, message: "湿度不能为空", trigger: "blur" }
        ],
        reflectTemp: [
          { required: true, message: "反射温度不能为空", trigger: "blur" }
        ],
        airTemp: [
          { required: true, message: "环境温度不能为空", trigger: "blur" }
        ],
        distance: [
          { required: true, message: "距离不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询测温参数列表 */
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
        name: null,
        tempUnit: null,
        tempRangeSwitch: null,
        tempRangeLowThreshold: null,
        tempRangeHighThreshold: null,
        imageWidth: null,
        imageHeight: null,
        tempImageSwitch: null,
        emissivity: null,
        humidity: null,
        reflectTemp: null,
        airTemp: null,
        distance: null,
        captureTime: null,
        captureFormat: null,
        colorPlate: null,
        imageFramerate: null
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
      this.title = "添加测温参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getParam(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改测温参数";
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
      this.$modal.confirm('是否确认删除测温参数编号为"' + ids + '"的数据项？').then(function() {
        return delParam(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('temp/param/export', {
        ...this.queryParams
      }, `param_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
