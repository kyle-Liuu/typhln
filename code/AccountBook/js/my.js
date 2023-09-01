/**
     * 接口文档地址：
     * https://www.apifox.cn/apidoc/shared-24459455-ebb1-4fdc-8df8-0aff8dc317a8/api-53371058
    **/
const app = new Vue({
    el: '#app',
    data: {
      creator: '小黑吖',
      list: [],
      name: '',
      price: ''
    },
    computed: {
      totalPrice() {
        return this.list.reduce((sum, item) => sum + item.price, 0)
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.myChart = echarts.init(document.querySelector('#main'))
      this.myChart.setOption({
        // 大标题
        title: {
          text: '消费账单列表',
          left: 'center'
        },
        // 提示框
        tooltip: {
          trigger: 'item'
        },
        // 图例
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        // 数据项
        series: [
          {
            name: '消费账单',
            type: 'pie',
            radius: '50%', // 半径
            data: [
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },

    methods: {
      async getList() {
        const res = await axios.get('https://applet-base-api-t.itheima.net/bill', {
          params: {
            creator: this.creator
          }
        })
        this.list = res.data.data

        // 更新图表
        this.myChart.setOption({
          // 数据项
          series: [
            {
              data: this.list.map(item => ({ value: item.price, name: item.name }))
            }
          ]
        })
      },
      async add() {
        if (!this.name) {
          alert('请输入消费名称')
          return
        }
        if (typeof this.price !== 'number') {
          alert('请输入正确的消费价格')
          return
        }

        // 发送添加请求
        const res = await axios.post('https://applet-base-api-t.itheima.net/bill', {
          creator: this.creator,
          name: this.name,
          price: this.price
        })
        // 重新渲染一次
        this.getList()

        this.name = ''
        this.price = ''
      },
      async del(id) {
        // 根据 id 发送删除请求
        const res = await axios.delete(`https://applet-base-api-t.itheima.net/bill/${id}`)
        // 重新渲染
        this.getList()
      },
      exportData() {
        // 准备要导出的数据
        const data = this.list;

        // 将数据转换为Excel格式
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

        // 创建Blob对象，并保存为Excel文件
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = '记账本消费明细.xlsx'; 
        const dataUrl = URL.createObjectURL(blob);

        // 创建下载链接并触发下载
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.click();
      }
    }
  })