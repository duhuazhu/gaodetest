<template>
  <div id="main">
    <div id="container">
    </div>
    <div class="navmenu">
      <span>地图应用</span>
      <el-button icon="el-icon-loginBtn" type="text" @click="openLogin"></el-button>
    </div>
    <div class="tool">
      <!--      <div @click="path">路线</div>-->
      <el-button icon="el-icon-map-location" @click="people" title="定位"></el-button>
      <el-button icon="iconfont icon-juli" @click="draw('rule')" title="距离测量"></el-button>
      <el-button icon="iconfont icon-mianji" @click="draw('measureArea')" title="面积测量"></el-button>
      <el-button icon="el-icon-delete" @click="deleteDraw()" title="清除标绘"></el-button>
    </div>
  </div>

</template>
<script>
import { loadVoLteResourceList } from '@/plugins/loadScript.js'
import { site } from '@/plugins/data'
import location_icon from '@/assets/images/loaction.png'
//可以传入多个地址
loadVoLteResourceList(['https://cache.amap.com/lbs/static/addToolbar.js', 'https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js'])
export default {
  data() {
    return {
      map: null,
      marker1: null,
      marker2: null,
      markerArray: [],
      placeSearch: null,
      visitorsArray: ['拥挤', '关闭', '舒适', '饱和'],
      mouseTool:null,
    }
  },
  methods: {
    openLogin () {
      this.$router.push({name: 'login'});
    },
    path() {

    },
    draw(type){
        switch(type){
          case 'rule':{
            this.mouseTool.rule({
              startMarkerOptions : {//可缺省
                icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  imageSize:new AMap.Size(19, 31),
                  image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
                })
              },
              endMarkerOptions : {//可缺省
                icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  imageSize:new AMap.Size(19, 31),
                  image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
                }),
                offset: new AMap.Pixel(-9, -31)
              },
              midMarkerOptions : {//可缺省
                icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  imageSize:new AMap.Size(19, 31),
                  image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
                }),
                offset: new AMap.Pixel(-9, -31)
              },
              lineOptions : {//可缺省
                strokeStyle: "solid",
                strokeColor: "#FF33FF",
                strokeOpacity: 1,
                strokeWeight: 2
              }
              //同 RangingTool 的 自定义 设置，缺省为默认样式
            });
            break;
          }
          case 'measureArea':{
            this.mouseTool.measureArea({
              strokeColor:'#80d8ff',
              fillColor:'#80d8ff',
              fillOpacity:0.3
              //同 Polygon 的 Option 设置
            });
            break;
          }
      }
    },
    deleteDraw(){
      if(this.mouseTool){
        this.mouseTool.close(true)//关闭，并清除覆盖物
      }
    },
    people() {
      this.marker1 = new AMap.Marker({
        icon: location_icon,
        offset: new AMap.Pixel(-10, -30),
        position: site.userPosition
      })
      this.map.add(this.marker1)
      this.map.setFitView()

    },
    location(value) {
      const _this = this
      AMap.service(['AMap.PlaceSearch'], function() {
        //构造地点查询类
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 25, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: site.city, // 兴趣点城市
          citylimit: true,  //是否强制限制在设置的城市内搜索
          map: map, // 展现结果的地图实例
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        })
        _this.markerArray = []
        //关键字查询
        _this.placeSearch = placeSearch
        if (window.flag) {
          placeSearch.searchNearBy(value, site.userPosition, 2000, function(status, result) {
            // 根据返回placeSearch 返回的数据 生成地图 marker
            for (let i = 0; i < result.poiList.pois.length; i++) {
              _this.addMarker(result.poiList.pois[i].location.lng, result.poiList.pois[i].location.lat, result.poiList.pois[i])
            }
            _this.placeSearch.clear()
          })
        } else {
          placeSearch.search(value, function(status, result) {
            // 根据返回placeSearch 返回的数据 生成地图 marker
            for (let i = 0; i < result.poiList.pois.length; i++) {
              _this.addMarker(result.poiList.pois[i].location.lng, result.poiList.pois[i].location.lat, result.poiList.pois[i])
            }
            _this.placeSearch.clear()
          })
        }

      })
    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    addMarker(lng, lat, message) {
      const _this = this
      let marker = new AMap.Marker({
        // icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: [lng, lat],
        offset: new AMap.Pixel(-13, -30),
        size: new AMap.Size(20, 20)//设置icon的大小
      })
      AMap.event.addListener(marker, 'click', function(e) {
        var lngX = e.lnglat.lng
        var latY = e.lnglat.lat
        map.setCenter([lngX, latY]) //点击marker 动态改变中心点
        window.message = message
        _this.$alert(`
           <h3>详细地址:${message.address}</h3>
           <h3>当前人流量:${_this.visitorsArray[_this.getRandom(0, 3)]}</h3>
            <el-button class="localBtn" onclick="gotoLocation()" type="primary">导航</el-button>
           `, `${message.name}`, {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          showClose: true
        })
      })
      _this.markerArray.push({
        marker,
        message
      })
      marker.setMap(map)
    }
  },
  mounted() {
    window.flag = false
    let token = window.sessionStorage.getItem('token')
    if (token === 'success') {
      window.flag = true
    } else {
      window.flag = false
    }
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 12 //地图显示的缩放级别
    })
    window.map = this.map

    this.mouseTool = new AMap.MouseTool(map);


    this.location('核酸采样点')
  }
}

function gotoLocation() {
  if (window.walking) {
    window.walking.clearMap
  }
  if (window.routeLineArray) {
    for (let i = 0; i < routeLineArray.length; i++) {
      map.remove(routeLineArray[i])
    }
  }

  // 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
  window.walkingOption = {}

  // 步行导航
  window.walking = new AMap.Walking(walkingOption)

  //根据起终点坐标规划步行路线
  walking.search(site.userPosition, [message.location.lng, message.location.lat], function(status, result) {
    // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
    if (status === 'complete') {
      if (result.routes && result.routes.length) {
        drawRoute(result.routes[0])
        log.success('绘制步行路线完成')
      }
    } else {
      log.error('步行路线数据查询失败' + result)
    }
  })

  function drawRoute(route) {
    var path = parseRouteToPath(route)

    var startMarker = new AMap.Marker({
      position: path[0],
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
      map: map,
      anchor: 'bottom-center'
    })

    var endMarker = new AMap.Marker({
      position: path[path.length - 1],
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
      map: map,
      anchor: 'bottom-center'
    })

    var routeLine = new AMap.Polyline({
      path: path,
      isOutline: true,
      outlineColor: '#ffeeee',
      borderWeight: 2,
      strokeWeight: 5,
      strokeColor: '#0091ff',
      strokeOpacity: 0.9,
      lineJoin: 'round'
    })

    map.add(routeLine)
    window.routeLineArray = []
    window.routeLineArray.push(startMarker, endMarker, routeLine)
    // 调整视野达到最佳显示区域
    map.setFitView([startMarker, endMarker, routeLine])
  }

  // 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
  // WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
  function parseRouteToPath(route) {
    var path = []

    for (var i = 0, l = route.steps.length; i < l; i++) {
      var step = route.steps[i]

      for (var j = 0, n = step.path.length; j < n; j++) {
        path.push(step.path[j])
      }
    }

    return path
  }
}

window.gotoLocation = gotoLocation
</script>
<style>
.el-message-box {
  width: 100% !important;
  bottom: 0px;
  position: absolute;
  left: 0;
}
.localBtn {
  background: #3F86FB;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
}
.iconfont{
  color: #606266;
}
</style>
<style lang="scss" scoped>
html,
body,
#container, #main {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;

  .navmenu {
    width: 100%;
    height: 60px;
    background: #3F86FB;
    position: fixed;
    z-index: 10;
    span {
      color: #fff;
      font-size: 30px;
      font-weight: bold;
      margin: 10px;
      line-height: 60px;
      font-family:"黑体",serif;
    }
    /deep/ .el-button {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 0.02667rem solid #fff;
      border-radius: 0.8rem;
      float: right;
      position: relative;
      margin: 10px;
      box-shadow: inset 0px 4px  6px 1px #78baff;

      .el-icon-loginBtn {
        width: 22px;
        height: 22px;
        background-image: url("../../assets/images/login_icon.png");
        background-size: cover;
      }
    }
  }

  .tool {
    position: fixed;
    top: 150px;
    right: -10px;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, 20%);
    width: 40px;
    height: 100px;
    z-index: 999;

    /deep/ .el-button {
      width: 40px;
      height: 40px;
      padding: 0;
      margin-left: 0;
      margin-bottom: 10px;

      i {
        font-size: 20px;
      }
    }
  }
}

#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
</style>
