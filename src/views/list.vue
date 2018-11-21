<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="currentList" :height="tableHeight" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="300">
      </el-table-column>
      <el-table-column label="内容" prop="content_short" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="作者" prop="author" width="180">
      </el-table-column>
      <el-table-column label="时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.timestamp | datetimeFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="{ name: `${$appName}-form` }">编辑</router-link>
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" type="text">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[50, 100, 200, 500]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },

    data() {
      return {
        list: null,
        currentList: null,
        listLoading: true,
        total: 0,
        listQuery: {
          page: 0,
          limit: 50,
        },
      }
    },

    computed: {
      tableHeight() {
        return window.innerHeight - 50 - 34 - 92
      },
    },

    methods: {
      pager() {
        const start = this.listQuery.page * this.listQuery.limit
        const end = start + this.listQuery.limit
        this.currentList = this.list.slice(start, end)
      },

      fetchData() {
        this.listLoading = true
        this.$ajax
          .get('/articles')
          .then(res => {
            const ret = res.data
            if (ret.code === 0) {
              this.list = ret.data
              this.total = this.list.length
              this.pager()
              this.listLoading = false
            } else {
              throw new Error(res.message)
            }
          })
          .catch(err => {
            this.loading = false
            this.$message.error(err.message || '数据拉取失败')
          })

        // this.$apollo.query({
        //   // 客户端名称 (必传。在main.js 里配置)
        //   client: `${APP_NAME}`,
        //   query: gql`query {
        //     articles {
        //       id
        //       title
        //     }
        //   }`,
        // })
        // .then(res => {
        //   this.listLoading = false
        //   this.list = res.data.articles
        // })
        // .catch(err => {
        //   this.loading = false
        //   this.$message.error(err.message || '数据拉取失败')
        // })
      },

      handleSizeChange(val) {
        this.listQuery.limit = val
        this.fetchData()
      },

      handleCurrentChange(val) {
        this.listQuery.page = val
        this.fetchData()
      },
    },

    created() {
      this.fetchData()
    },
  }
</script>

<style scoped>
  @import '@peak-stone/vue-admin/assets/css/vars.css';
  $pager-height: 92px;

  .pagination-container {
    height: $pager-height;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
