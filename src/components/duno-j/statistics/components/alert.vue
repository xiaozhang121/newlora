<template>
  <el-dialog :visible="visible" @close="handleClose">
    <el-form :model="form" ref="form">
      <el-form-item prop="type">
        <el-radio-group v-model="form.type">
          <el-row style="margin-bottom: 20px">
            <el-radio label="no">无</el-radio>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-radio style="margin-top: 10px;" label="day">每天</el-radio>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="hour">
                <el-select v-model="form.hour">
                  <el-option v-for="item in hourList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="font-size: 16px;line-height:36px;padding-left:10px">时</el-col>
            <el-col :span="5">
              <el-form-item prop="hour">
                <el-select v-model="form.minute">
                  <el-option v-for="item in minuteList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="font-size: 16px;line-height:36px;padding-left:10px">分</el-col>
          </el-row>
          <el-row style="margin-bottom: 20px">
            <el-col :span="4">
              <el-radio style="margin-top: 10px;" label="week">每周</el-radio>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="day">
                <el-select v-model="form.day">
                  <el-option
                    v-for="item in ['一', '二', '三', '四', '五', '六', '日']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 20px">
            <el-col :span="4">
              <el-radio style="margin-top: 10px;" label="month">每月</el-radio>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="date">
                <el-select v-model="form.date">
                  <el-option v-for="item in dateList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="font-size: 16px;line-height:36px;padding-left:10px">日</el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      form: {
        type: "no",
        hour: "00",
        minute: "00",
        day: "一",
        date: "01"
      },
      hourList: [],
      minuteList: [],
      dateList: []
    };
  },
  mounted() {
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.hourList.push("0" + i);
      } else {
        this.hourList.push("" + i);
      }
    }
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.minuteList.push("0" + i);
      } else {
        this.minuteList.push("" + i);
      }
    }
    for (let i = 1; i < 32; i++) {
      if (i < 10) {
        this.dateList.push("0" + i);
      } else {
        this.dateList.push("" + i);
      }
    }
  },
  methods: {
    handleSubmit() {
      const { type } = this.form;
      const form = this.form;
      switch (type) {
        case "day":
          const hour = form.hour;
          const minute = form.minute;
          this.$emit("handleSubmit", { hour, minute, type });
          break;
        case "week":
          const day = form.day;
          this.$emit("handleSubmit", { day, type });
          break;
        case "month":
          const date = form.date;
          this.$emit("handleSubmit", { date, type });
          break;
        default:
          this.$emit("handleSubmit", { type });
          break;
      }
    },
    handleClose() {
      this.$emit("handleClose");
    }
  }
};
</script>
