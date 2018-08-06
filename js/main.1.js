var scene, camera
var renderer
var width, width

var cars = []
// var stats

var config = {
  isMobile: false,
  background: 0x282828
}

width = window.innerWidth
height = window.innerHeight

scene = new THREE.Scene() // 新建一个场景
camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000) // 新建一个透视摄像机, 并设置 视场, 视野长宽比例, 可见远近范围
// 摄像机的位置
camera.position.set(0, 360, 400)
camera.lookAt(scene.position) // 设置摄像机观察的方向

renderer = new THREE.WebGLRenderer({ antialias: true }) // 新建一个渲染器, 渲染器用来输出最终结果
renderer.setSize(width, height) // 设置渲染的尺寸, 在这里是浏览器尺寸
renderer.setClearColor(config.background)  // 设置背景的颜色
renderer.shadowMap.enabled = true // 设置是否开启投影, 开启的话, 光照会产生投影
renderer.shadowMap.type = THREE.PCFSoftShadowMap // 设置投影类型, 这边是柔和投影
/* document.body.appendChild(renderer.domElement) */ // renderer.domElement 是渲染器用来显示结果的 canvas 标签
$('.zone').eq(3).append(renderer.domElement)
// 检查客户端
checkUserAgent()
// 设置辅助线 以及鼠标插件
buildAuxSystem()
// 设置光照
buildLightSystem()
// 构造建筑物
buildbuilding()
//buildRoad()
//buildStaticCars()
//buildMovingCars()

loop()
onWindowResize()


function fontModel() {
/*   var fontModel
  var font
  var loader = new THREE.FontLoader()
  var fontPosition = [
    [-136, 86, -18],
    [-62, 86, -18],
    [18, 86, -18],
    [94, 86, -18],
    [-136, 86, 51],
    [-62, 86, 51],
    [18, 86, 51],
    [94, 86, 51]
  ]
  var fontarray = new Array("行走控制柜", "料斗、皮带控制柜","主副缆切换开关箱","主副缆切换开关箱","主副缆切换开关箱","主副缆切换开关箱","主副缆切换开关箱","主副缆切换开关箱")
  loader.load("../../static/3D/js/Microsoft YaHei_Regular.js", function (res) {
    for (var i = 0; i < 8; i++){
      font = new THREE.TextBufferGeometry(fontarray[i], {  
        font: res,  
        size: 4,  
        height: 1  
      })
    font.computeBoundingBox() // 运行以后设置font的boundingBox属性对象，如果不运行无法获得。
    var material = new THREE.MeshLambertMaterial({})
    fontModel = new THREE.Mesh(font, material) 
    //设置位置  
    var fontClone = fontModel.clone()
      debugger;
    fontClone.position.set(fontPosition[i][0], fontPosition[i][1], fontPosition[i][2])
      scene.add(fontClone)
    }    
  })   */
}  

function checkUserAgent() {
  var n = navigator.userAgent;
  if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i)) {
    config.isMobile = true
    camera.position.set(420, 420, 420)
    renderer.shadowMap.enabled = false
  }
}
// 动态的车
function buildMovingCars() {
  var carsPosition = [
    [-130, 145, 0],
    [10, 145, 0],
    [145, 20, 0.5],
    [30, -145, 1],
    [-145, -60, 1.5]
  ]
  carsPosition.forEach(function(elem) {
    var car = new Car()
    var x = elem[0],
      z = elem[1],
      r = elem[2]
    car.setPosition(x, 0, z)
    car.mesh.rotation.y = r * Math.PI
    cars.push(car)
    scene.add(car.mesh)
  })
}
// 静止的车
function buildStaticCars() {
  var carsPosition = [
    [-84, 82, 1.5],
    [-58, 82, 1.5],
    [-32, 82, 1.5],
    [84, 82, 1.5]
  ]
  carsPosition.forEach(function(elem) {
    var car = new Car()
    var x = elem[0],
      z = elem[1],
      r = elem[2]
    car.setPosition(x, 0, z)
    car.mesh.rotation.y = r * Math.PI
    scene.add(car.mesh)
  })
}

function buildRoad() {
  var road = new THREE.Object3D()
  // 路线颜色
  // 测试 0x008000
  var roadColor = 0xffffff 
  var roadBorderOuterCoords = [
    [-160, 160],
    [160, 160],
    [160, -160],
    [-160, -160],
  ]
  // 路最外层边框
  var roadBorderOuterHoleCoords = [
    [-159, 159],
    [-159, -159],
    [159, -159],
    [159, 159]
  ]
  var roadBorderOuterShape = utils.makeShape(roadBorderOuterCoords, roadBorderOuterHoleCoords)

  var roadBorderOuterGeometry = utils.makeExtrudeGeometry(roadBorderOuterShape, 0.1)
  var roadBorderOuter = utils.makeMesh('phong', roadBorderOuterGeometry, roadColor)
  road.add(roadBorderOuter)
  
  // 路最内层边框
  var roadBorderInnerCoords = [
    [-131, 131],
    [-131, -131],
    [131, -131],
    [131, 131],
    [19, 131],
    [19, 99],
    [99, 99],
    [99, -99],
    [-99, -99],
    [-99, 99],
    [-19, 99],
    [-19, 131]
  ]
  var roadBorderInnerShape = utils.makeShape(roadBorderInnerCoords)
  var roadBorderInnnerGeometry = utils.makeExtrudeGeometry(roadBorderInnerShape, 0.1)
  var roadBoaderInnder = utils.makeMesh('phong', roadBorderInnnerGeometry, roadColor)
  roadBoaderInnder.rotation.y = Math.PI
  road.add(roadBoaderInnder)

  var roadLinesGeometry = new THREE.Geometry()

  // 构造马路中间线立方体的长宽高
  var roadLineGeometry = new THREE.BoxGeometry(20, 0.1, 2)

  var roadLinesBottomGeometry = new THREE.Geometry()
  for (var i = 0; i < 9; i++) {
    var geometry = roadLineGeometry.clone()
    geometry.translate(i * 30, 0, -1)
    roadLinesBottomGeometry.merge(geometry)
  }
  roadLinesBottomGeometry.translate(-120, 0, 145)
  roadLinesGeometry.merge(roadLinesBottomGeometry)

  var roadLinesTopGeometry = roadLinesBottomGeometry.clone()
  roadLinesTopGeometry.translate(0, 0, -290)
  roadLinesGeometry.merge(roadLinesTopGeometry)

  var roadLinesLeftGeometry = roadLinesBottomGeometry.clone()
  roadLinesLeftGeometry.rotateY(0.5 * Math.PI)
  roadLinesGeometry.merge(roadLinesLeftGeometry)

  var roadLinesRightGeometry = roadLinesBottomGeometry.clone()
  roadLinesRightGeometry.rotateY(-0.5 * Math.PI)
  roadLinesGeometry.merge(roadLinesRightGeometry)
  roadLinesGeometry = new THREE.BufferGeometry().fromGeometry(roadLinesGeometry)
  var roadLines = utils.makeMesh('phong', roadLinesGeometry, roadColor)
  road.add(roadLines)

  scene.add(road)
}

function buildbuilding() {
  // 创建底座 长/宽/高
  var planeGeometry = new THREE.BoxBufferGeometry(320, 6, 200)
  // 设置材质
  

  var texturePlane = new THREE.TextureLoader().load("../../static/3D/img/floor.jpg");
  texturePlane.wrapS = THREE.RepeatWrapping;
  texturePlane.wrapT = THREE.RepeatWrapping;
  texturePlane.repeat.set( 8, 8 );
  var materialPlane = new THREE.MeshPhongMaterial({ map: texturePlane,color:0xBEC9BE});
  var plane = new THREE.Mesh(planeGeometry, materialPlane);
  plane.rotation.z = -Math.PI
  // 网格线上浮
  plane.position.y = -1
  // 添加网格线
  scene.add(plane)
  fontModel()
  // 篱笆
  //addFense()
  // 草坪
  //addGreen()
  // 树
  //addTrees()
  // 医院
  //addHospital()
  // 路灯
  //addLamps()
  room()
  //waterDispenser()
  machine()
  //fileCabinets()
  smoke()
  temperature()
  controller()

  // 房间主结构
  function room() {
    // 墙
    var room = new THREE.Object3D()
    var wallCoords = [
      [-160, -100],
      [-160, 100],
      [160, 100],
      [160, -100],
      [-160, -100]
    ]
    var wallHolePath = [
      [-155, -95],
      [155, -95],
      [155, 95],
      [-155, 95],
      [-155, -95]
    ]
    var wallShape = utils.makeShape(wallCoords, wallHolePath) 
    var wallGeometry = utils.makeExtrudeGeometry(wallShape, 70)
    var wall = utils.makeMesh('phong', wallGeometry, 0xA5BDDD)
    scene.add(wall)

    // 门
    var door1 = new THREE.BoxBufferGeometry(40, 71, 7)
    var door = utils.makeMesh('phong', door1, 0xD2691E)
    door.receiveShadow = false
    door.position.set(-95, 35, 98)
    scene.add(door)
    // 门把手
    var doorknobGeo = new THREE.CylinderGeometry(3, 3, 2,40 ,40);
    var doorknob = utils.makeMesh('lambert', doorknobGeo, 0xBDB76B)
    doorknob.rotation.x = -0.5 * Math.PI
    doorknob.position.set(-80, 30, 103) //设置圆柱坐标 
    scene.add(doorknob)
  }

  // 饮水机
  function waterDispenser() {
    var waterDispenser = new THREE.Object3D()
    
    // 饮水机柜
    var waterDispenserCoords = [
      [-15, -30],
      [-15, 30],
      [15, 30],
      [15, -30],
      [-15, -30]
    ]
    var waterDispenserHolePath = [
      [-14, -29],
      [14, -29],
      [14, 29],
      [-14, 29],
      [-14, -29]
    ]
    var waterDispenserShape = utils.makeShape(waterDispenserCoords,waterDispenserHolePath) 
    var waterDispenserGeometry = utils.makeExtrudeGeometry(waterDispenserShape, 20)
    var waterDispenserMain = utils.makeMesh('lambert', waterDispenserGeometry, 0x00ffffff)
    waterDispenserMain.rotation.x = -0.5 * Math.PI
    waterDispenserMain.position.x = -135
    waterDispenserMain.position.y = 30
    waterDispenserMain.position.z = -75
    waterDispenser.add(waterDispenserMain)
    // 饮水机隔断
    var waterDispenserSeparatorGeometry = new THREE.BoxBufferGeometry(28, 1, 20)
    var waterDispenserSeparator = utils.makeMesh('phong', waterDispenserSeparatorGeometry, 0x00ffffff)
    waterDispenserSeparator.position.set(-135, 35, -85)
    waterDispenser.add(waterDispenserSeparator)
    // 饮水机下面板
    var waterDispenserUpGeometry = new THREE.BoxBufferGeometry(28, 32, 1)
    var waterDispenserUp = utils.makeMesh('phong', waterDispenserUpGeometry, 0x00000000)
    waterDispenserUp.position.set(-135, 18, -75)
    waterDispenser.add(waterDispenserUp)
    // 饮水机下面板提手
    var waterDispenserUpBarGeometry = new THREE.BoxBufferGeometry(20, 1, 1)
    var waterDispenserUpBar = utils.makeMesh('phong', waterDispenserUpBarGeometry, 0x00ffffff)
    waterDispenserUpBar.position.set(-135, 20, -74)
    waterDispenser.add(waterDispenserUpBar)
    // 饮水机上面板
    var waterDispenserDownGeometry = new THREE.BoxBufferGeometry(28, 23, 1)
    var waterDispenserDown = utils.makeMesh('phong', waterDispenserDownGeometry, 0x00ff0000)
    waterDispenserDown.position.set(-135, 47, -75)
    waterDispenser.add(waterDispenserDown)
    // 饮水机上面板提手
    var waterDispenserDownBarGeometry = new THREE.BoxBufferGeometry(6, 1, 1)
    var waterDispenserDownBar = utils.makeMesh('phong', waterDispenserDownBarGeometry, 0x00ffffff)
    waterDispenserDownBar.position.set(-135, 47, -74)
    waterDispenser.add(waterDispenserDownBar)
    scene.add(waterDispenser)
  }

  // 烟感
  function smoke() {
    var smokePosition = [
      [0, 0, 0],
      [75, 0, 0],
      [155, 0, 0],
      [230, 0, 0],
      [0, 0, 70],
      [75, 0, 70],
      [155, 0, 70],
      [230, 0, 70]
    ]
    var smoke = new THREE.Object3D()
    var smokeBaseGeometry = new THREE.CylinderGeometry(8,8,4,40,5)
    var smokeBase = utils.makeMesh('lambert',smokeBaseGeometry,0xE8E8E8)
    smokeBase.position.set(-126,96,-50)
    smoke.add(smokeBase)

    var smokeUpGeometry = new THREE.CylinderGeometry(6,6,2,40,5)
    var smokeUp = utils.makeMesh('glass',smokeUpGeometry,0x008B00,0.4)
    /* smokeUp.rotation.x = 0.5*Math.PI */
    smokeUp.position.set(-126,98,-50)
    smoke.add(smokeUp)

    var smokeCoverGeometry = new THREE.CylinderGeometry(4,5,3,40,5)
    var smokeCover = utils.makeMesh('lambert',smokeCoverGeometry,0xE8E8E8)
    /* smokeUp.rotation.x = 0.5*Math.PI */
    smokeCover.position.set(-126,100,-50)
    smoke.add(smokeCover) 

    for (var i = 0; i < 8; i++){
      var smokeClone = smoke.clone()
      smokeClone.position.set(smokePosition[i][0], smokePosition[i][1], smokePosition[i][2])
      scene.add(smokeClone)
    } 
    
  }

  // 温感
  function temperature() {
    var temperaturePosition = [
      [0, 0, 0],
      [75, 0, 0],
      [155, 0, 0],
      [230, 0, 0],
      [0, 0, 70],
      [75, 0, 70],
      [155, 0, 70],
      [230, 0, 70]
    ]
    var temperature = new THREE.Object3D()
    // var temperatureBaseGeometry = new THREE.CylinderGeometry(5,8,1,40,40)
    // var temperatureBase = utils.makeMesh('phong',temperatureBaseGeometry,0xE8E8E8)
    // temperatureBase.position.set(-104,96,-50)
    // temperature.add(temperatureBase)

    var temperaturePillarGeometry = new THREE.CylinderGeometry(6,6,4,40,40)
    var temperaturePillar = utils.makeMesh('phong',temperaturePillarGeometry,0xE8E8E8)
    temperaturePillar.position.set(-104,95,-50)
    temperature.add(temperaturePillar)

    var temperatureUpGeometry = new THREE.CylinderGeometry(6,6,3,40,5)
    var temperatureUp = utils.makeMesh('glass',temperatureUpGeometry,0x000080,0.8)
    /* smokeUp.rotation.x = 0.5*Math.PI */
    temperatureUp.position.set(-104,98,-50)
    temperature.add(temperatureUp)

    var temperatureCoverGeometry = new THREE.SphereGeometry(6, 20, 6, 0, Math.PI * 2, 0, Math.PI / 2)
    var temperatureCover = utils.makeMesh('phong',temperatureCoverGeometry,0xE8E8E8)
    temperatureCover.position.set(-104,100,-50)
    temperature.add(temperatureCover)   

    for (var i = 0; i < 8; i++){
      var temperatureClone = temperature.clone()
      temperatureClone.position.set(temperaturePosition[i][0], temperaturePosition[i][1], temperaturePosition[i][2])
      scene.add(temperatureClone)
    } 
  }

  // 火警
  function controller() {
    var controllerPosition = [
      [0, 0, 0],
      [75, 0, 0],
      [155, 0, 0],
      [230, 0, 0],
      [0, 0, 70],
      [75, 0, 70],
      [155, 0, 70],
      [230, 0, 70]
    ]
    var controller = new THREE.Object3D()

    var controllerBaseGeometry = new THREE.BoxGeometry(16, 8, 10)
    var controllerBase = utils.makeMesh('phong',controllerBaseGeometry,0xE8E8E8)
    controllerBase.position.set(-126,99,-26)
    controller.add(controllerBase)

    var controllerLeftBarGeometry = new THREE.BoxGeometry(2, 5, 12)
    var controllerLeftBar = utils.makeMesh('glass',controllerLeftBarGeometry,0x848484,0.9)
    controllerLeftBar.position.set(-134,99,-26)
    controller.add(controllerLeftBar)
    var controllerRightBar = controllerLeftBar.clone()
    controllerRightBar.position.set(-118,99,-26)
    controller.add(controllerRightBar)

    var lampGeometry = new THREE.CircleGeometry(0.5, 36, 0, Math.PI*2)
    var lampGreen = utils.makeMesh('glass',lampGeometry,0x00EE00,0.9)
    lampGreen.position.set(-129,102,-20)
    controller.add(lampGreen)
    var lampYellow = utils.makeMesh('glass',lampGeometry,0xEEEE00,0.9)
    lampYellow.position.set(-127,102,-20)
    controller.add(lampYellow)
    var lampRed = utils.makeMesh('glass',lampGeometry,0xEE0000,0.9)
    lampRed.position.set(-125,102,-20)
    controller.add(lampRed)

    var controllerButtonGeometry = new THREE.BoxGeometry(4, 2, 0.1)
    var controllerButton = utils.makeMesh('phong',controllerButtonGeometry,0x4A708B)
    controllerButton.castShadow = false
    controllerButton.position.set(-128,98,-20)
    controller.add(controllerButton)

    var controllerButtonClone = controllerButton.clone()
    controllerButtonClone.position.set(-123,98,-20)
    controller.add(controllerButtonClone)
 
/*     var colorindex = 0 

    var colorarray = new Array(0xEE0000, 0xE8E8E8)
     setInterval(function () {
       debugger
      colorindex++
      if (colorindex == 3) {
        colorindex = 0
      }
      controllerBase.material.color.set(colorarray[colorindex])
      
    }, 200); */

     for (var i = 0; i < 8; i++){
      var controllerClone = controller.clone()
      controllerClone.position.set(controllerPosition[i][0], controllerPosition[i][1], controllerPosition[i][2])
      scene.add(controllerClone)
    }  
  } 

  // 机柜
  function machine() {
    var machine = new THREE.Object3D()
    var machinePosition = [
      [-115, 0, -20],
      [-40, 0, -20],
      [40, 0, -20],
      [115, 0, -20],
      [-115, 0, 50],
      [-40, 0, 50],
      [40, 0, 50],
      [115, 0, 50]
    ]

    var textureFront = new THREE.TextureLoader().load("../../static/3D/img/rack_front_door.jpg");
    var materialFront = new THREE.MeshPhongMaterial({ map: textureFront});
    var machineFrontGeometry = new THREE.BoxBufferGeometry(2, 90, 50)
    var machineFront = new THREE.Mesh(machineFrontGeometry, materialFront);
    machineFront.rotation.y = -0.5 * Math.PI
    machineFront.position.set(0, 48, 0)
    machine.add(machineFront)

    var textureBack = new THREE.TextureLoader().load("../../static/3D/img/rack_door_back.jpg");
    var materialBack = new THREE.MeshPhongMaterial({map:textureBack});
    var machineBackGeometry = new THREE.BoxBufferGeometry(2, 90, 50)
    var machineBack = new THREE.Mesh(machineBackGeometry, materialBack);
    machineBack.rotation.y = -0.5 * Math.PI
    machineBack.position.set(0, 48, -40)
    machine.add(machineBack)

    var textureLeft = new THREE.TextureLoader().load("../../static/3D/img/rack_panel.jpg");
    var materialLeft = new THREE.MeshPhongMaterial({map:textureLeft, color:0x383838});
    var machineLeftGeometry = new THREE.BoxBufferGeometry(2, 90, 40)
    var machineLeft = new THREE.Mesh(machineLeftGeometry, materialLeft);
    machineLeft.position.set(-26, 48, -20)
    machine.add(machineLeft)

    var machineRight = machineLeft.clone()
    machineRight.position.set(26, 48, -20)
    machine.add(machineRight)

    var textureBottom = new THREE.TextureLoader().load("../../static/3D/img/rack_panel.jpg");
    var materialBottom = new THREE.MeshPhongMaterial({map:textureBottom, color:0x383838});
    var machineBottomGeometry = new THREE.BoxBufferGeometry(54, 2,42)
    var machineBottom = new THREE.Mesh(machineBottomGeometry, materialBottom);
    machineBottom.position.set(0, 2, -20)
    machine.add(machineBottom)

    var textureTop = new THREE.TextureLoader().load("../../static/3D/img/rack_panel.jpg");
    var materialTop = new THREE.MeshPhongMaterial({map:textureTop, color:0x383838});
    var machineTopGeometry = new THREE.BoxBufferGeometry(46, 3,44)
    var machineTop = new THREE.Mesh(machineTopGeometry, materialTop);
    machineTop.position.set(0, 93, -20)
    machine.add(machineTop)

    for (var i = 0; i < 8; i++){
      var machineClone = machine.clone()
      machineClone.position.set(machinePosition[i][0], machinePosition[i][1], machinePosition[i][2])
      scene.add(machineClone)
    }  
    
    
  }  

  // 文件柜
  function fileCabinets() {
    // 创建立方体几何体-柜子
    var sphereGeometry = new THREE.BoxGeometry(20, 80, 50)
    var sphere = utils.makeMesh('phong', sphereGeometry, 0xEBEBEB)
    // 创建立方体几何体-柜子窗户
    var cubeGeometry = new THREE.BoxGeometry(20, 10, 10)
    var cube1 = utils.makeMesh('phong', cubeGeometry, 0x00000000)
    cube1.position.y = 25
    cube1.position.x = -10
    cube1.position.z = 15

    var cube2 = cube1.clone()
    cube2.position.z = 0

    var cube3 = cube1.clone()
    cube3.position.z = -15

    // 创建梯形体-柜子低凹槽
    var cube4Geometry = new THREE.Geometry()

    // 创建一个立方体
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    // 创建立方体的顶点
    var vertices = [
        new THREE.Vector3(15, 10, 4), //v0
        new THREE.Vector3(-15, 10, 4), //v1
        new THREE.Vector3(-20, 0, 4), //v2
        new THREE.Vector3(20, 0, 4), //v3
        new THREE.Vector3(20, 0, -4), //v4
        new THREE.Vector3(15, 10, -4), //v5
        new THREE.Vector3(-15, 10, -4), //v6
        new THREE.Vector3(-20, 0, -4) //v7
    ];
    cube4Geometry.vertices = vertices

    //创建立方的面
    var faces=[
        new THREE.Face3(0,1,2),
        new THREE.Face3(0,2,3),
        new THREE.Face3(0,3,4),
        new THREE.Face3(0,4,5),
        new THREE.Face3(1,6,7),
        new THREE.Face3(1,7,2),
        new THREE.Face3(6,5,4),
        new THREE.Face3(6,4,7),
        new THREE.Face3(5,6,1),
        new THREE.Face3(5,1,0),
        new THREE.Face3(3,2,7),
        new THREE.Face3(3,7,4)
    ];
    cube4Geometry.faces = faces

    //生成法向量
    cube4Geometry.computeFaceNormals();
    var cube4Material = new THREE.MeshLambertMaterial({color: 0x00ffff})
        cube4 = new THREE.Mesh(cube4Geometry, cube4Material)
        cube4.rotation.y = -0.5 * Math.PI
        cube4.position.y = -40
        cube4.position.x = -7
        cube4.position.z = 0

    //生成ThreeBSP对象
    var sphereBSP = new ThreeBSP(sphere)
    var cube1BSP = new ThreeBSP(cube1)
    var result1BSP = utils.bsp('subtract', sphereBSP, cube1BSP)

    var cube2BSP = new ThreeBSP(cube2)
    var result2BSP = utils.bsp('subtract', result1BSP, cube2BSP)

    var cube3BSP = new ThreeBSP(cube3)
    var result3BSP = utils.bsp('subtract', result2BSP, cube3BSP)

    var cube4BSP = new ThreeBSP(cube4)
    var result4BSP = utils.bsp('subtract',result3BSP,cube4BSP)
    
    // 重新赋值一个纹理
    var result = utils.bspMesh('phong',0xEBEBEB,result4BSP)
    result.position.set(140, 47, 65)  
    // 将计算出来模型添加到场景当中
    scene.add(result)

    // 蓝色文件柜
    var fileCabinetsBlue = new THREE.Object3D()
    var fileCabinets1Geometry = new THREE.BoxGeometry(15, 60, 20)
    var fileCabinets1 = utils.makeMesh('phong', fileCabinets1Geometry, 0x27408B) 

    // 窗户
    var glassHoleGeometry = new THREE.BoxGeometry(10, 20, 12)
    var glassHole = utils.makeMesh('phong', glassHoleGeometry, 0x27408B) 
    glassHole.position.x = -5
    glassHole.position.y = 15
  
    var glassHoleBSP = new ThreeBSP(glassHole)
    var fileCabinets1BSP = new ThreeBSP(fileCabinets1)
    var fileCabinets1ResultBSP = utils.bsp('subtract', fileCabinets1BSP, glassHoleBSP)
    var fileCabinets1Result = utils.bspMesh('phong',0x27408B,fileCabinets1ResultBSP)
    fileCabinets1Result.position.set(140, 30, 26)
    fileCabinetsBlue.add(fileCabinets1Result)

    // 玻璃
    var glassGeometry = new THREE.BoxGeometry(1, 20, 12)
    var glass = utils.makeMesh('glass', glassGeometry, 0XECF1F3)
    glass.castShadow = false
    glass.position.set(133, 44, 26)
    fileCabinetsBlue.add(glass)
    scene.add(fileCabinetsBlue)
    
    // 货架
    var shelves = new THREE.Geometry()
    var shelvesGeometry = new THREE.BoxGeometry(2, 2, 20)

    // for z-axis
    for (var i = 0; i < 4; i++) {
      var shelvesZ1Clone = shelvesGeometry.clone()
      shelvesZ1Clone.translate(0, i * 10, 0)
      shelves.merge(shelvesZ1Clone)
    }
    for (var i = 0; i < 4; i++) {
      var shelvesZ2Clone = shelvesGeometry.clone()
      shelvesZ2Clone.translate(30, i * 10, 0)
      shelves.merge(shelvesZ2Clone)
    }
    // for x-axis
    for (var i = 0; i < 4; i++) {
      var shelvesX1Clone = shelvesGeometry.clone()
      shelvesX1Clone.rotateY(0.5 * Math.PI)
      shelvesX1Clone.scale(1.5, 1, 1)
      shelvesX1Clone.translate(15, i * 10, 10)
      shelves.merge(shelvesX1Clone)
    }
    for (var i = 0; i < 4; i++) {
      var shelvesX2Clone = shelvesGeometry.clone()
      shelvesX2Clone.rotateY(0.5 * Math.PI)
      shelvesX2Clone.scale(1.5, 1, 1)
      shelvesX2Clone.translate(15, i * 10, -10)
      shelves.merge(shelvesX2Clone)
    }
    // for x-axis
    for (var i = 0; i < 2; i++) {
      var shelvesZ1Clone = shelvesGeometry.clone()
      shelvesZ1Clone.rotateX(0.5 * Math.PI)
      shelvesZ1Clone.scale(1, 2.5, 1)
      shelvesZ1Clone.translate(i * 30, 8, 10)
      shelves.merge(shelvesZ1Clone)
    }
    for (var i = 0; i < 2; i++) {
      var shelvesZ2Clone = shelvesGeometry.clone()
      shelvesZ2Clone.rotateX(0.5 * Math.PI)
      shelvesZ2Clone.scale(1, 2.5, 1)
      shelvesZ2Clone.translate(i * 30, 8, -10)
      shelves.merge(shelvesZ2Clone)
    }

    shelves = new THREE.BufferGeometry().fromGeometry(shelves)
    var shelvesResult = utils.makeMesh('phong', shelves, 0x607B8B)
    shelvesResult.position.set(122, 16, 0)
    scene.add(shelvesResult)

    // 货物
    var goods = new THREE.Geometry()
    var goodsGeometry = new THREE.BoxGeometry(13, 50, 8)
    for (var i = 0; i < 2; i++) {
      var goodsZ1Clone = goodsGeometry.clone()
      goodsZ1Clone.translate(0, 0, i * 10)
      var goodsZ2Clone = goodsZ1Clone.clone()
      goodsZ2Clone.translate(15, 0, 0)
      goods.merge(goodsZ1Clone)
      goods.merge(goodsZ2Clone)
    }
    goods = new THREE.BufferGeometry().fromGeometry(goods)
    var goodsResult = utils.makeMesh('phong', goods, 0xB8860B)
    goodsResult.position.set(131, 24, -5)
    scene.add(goodsResult)

    // 收纳柜
    var storageBox = new THREE.Object3D()
    // 柜子主体
    var storageBoxGeometry = new THREE.BoxGeometry(30, 70, 40)
    var storageBoxObj = utils.makeMesh('phong', storageBoxGeometry, 0xEBEBEB)
    // 柜子侧边
    var storageBoxHole1Geometry = new THREE.BoxGeometry(2, 69, 15)
    var storageBoxHole1 = utils.makeMesh('phong', storageBoxHole1Geometry, 0xEBEBEB)

    storageBoxHole1.position.x = -12
    storageBoxHole1.position.z = 20

    var storageBoxHole2 = storageBoxHole1.clone()

    storageBoxHole2.position.x = 12
    //  柜子底层
    var storageBoxHole3Geometry = new THREE.BoxGeometry(20, 42, 32)
    var storageBoxHole3 = utils.makeMesh('phong', storageBoxHole3Geometry, 0xEBEBEB)
    storageBoxHole3.position.x = -10
    storageBoxHole3.position.y = -10

    var storageBoxHole1BSP = new ThreeBSP(storageBoxHole1)
    var storageBoxObj1BSP = new ThreeBSP(storageBoxObj)
    var storageBoxObj1ResultBSP = utils.bsp('subtract', storageBoxObj1BSP, storageBoxHole1BSP)

    var storageBoxHole2BSP = new ThreeBSP(storageBoxHole2)
    var storageBoxObj2ResultBSP = utils.bsp('subtract', storageBoxObj1ResultBSP, storageBoxHole2BSP)

    var storageBoxHole3BSP = new ThreeBSP(storageBoxHole3)
    var storageBoxObj3ResultBSP = utils.bsp('subtract', storageBoxObj2ResultBSP, storageBoxHole3BSP)

    var storageBoxObjResult = utils.bspMesh('phong', 0xEBEBEB, storageBoxObj3ResultBSP)
    storageBoxObjResult.position.set(140, 47, -34)
    storageBox.add(storageBoxObjResult)
    
    // 柜子把手
    var storageBoxBarGeometry = new THREE.BoxBufferGeometry(1, 3, 6)
    var storageBoxBar = utils.makeMesh('phong', storageBoxBarGeometry, 0x292929)
    storageBoxBar.castShadow = false
    storageBoxBar.position.set(124, 74, -28)
    storageBox.add(storageBoxBar)
    
    // 柜子底层门
    var storageBoxHole3Door = utils.makeMesh('phong', storageBoxHole3Geometry, 0x838B8B)
    storageBoxHole3Door.position.set(135, 36, -34)
    var storageBoxHole3DoorMaterial = new THREE.MeshBasicMaterial( { color: 0x2F4F4F,opacity: 0.9,transparent: true});
    storageBoxHole3Door.material = storageBoxHole3DoorMaterial
    storageBox.add(storageBoxHole3Door)
    
    // 箱子
    var BoxGeometry = new THREE.BoxBufferGeometry(20, 60, 20)
    var Box = utils.makeMesh('phong', BoxGeometry, 0xCD8500)
    Box.position.set(140, 34, -74)
    storageBox.add(Box)
    scene.add(storageBox) 
  }



  function addLamps() {
    var lampsPosition = [
      [-12.5, 12.5, 1.25],
      [-7.5, 12.5, -0.5],
      [-2.5, 12.5, -0.5],
      [2.5, 12.5, -0.5],
      [7.5, 12.5, -0.5],
      [12.5, 12.5, -0.25],
      [12.5, 7.5, 0],
      [12.5, 2.5, 0],
      [12.5, -2.5, 0],
      [12.5, -7.5, 0],
      [12.5, -12.5, 0.25],
      [7.5, -12.5, 0.5],
      [2.5, -12.5, 0.5],
      [-2.5, -12.5, 0.5],
      [-7.5, -12.5, 0.5],
      [-12.5, -12.5, 0.75],
      [-12.5, -7.5, 1],
      [-12.5, -2.5, 1],
      [-12.5, 2.5, 1],
      [-12.5, 7.5, 1],
    ]

    lampsPosition.forEach(function(elem) {
      var x = elem[0] * 10,
        z = elem[1] * 10,
        r = elem[2]
      var lamp = createLamp()
      lamp.rotation.y = r * Math.PI
      lamp.position.set(x, 0, z)
      scene.add(lamp)
    })
  }

  function addHospital() {
    var hospital = createHospital()
    hospital.position.z = -20
    scene.add(hospital)
  }

  function addGreen() {
    var greenCoords = [
      [-120, -120],
      [-120, 120],
      [120, 120],
      [120, -120],
      [20, -120],
      [20, -100],
      [100, -100],
      [100, 100],
      [-100, 100],
      [-100, -100],
      [-20, -100],
      [-20, -120],
      [-120, -120]
    ]
    var greenShape = utils.makeShape(greenCoords)
    var greenGeometry = utils.makeExtrudeGeometry(greenShape, 3)
    var green = utils.makeMesh('lambert', greenGeometry, 0xc0c06a)
    scene.add(green)
  }
	// 添加墙
  function addFense() {
    var fenseCoords = [
      [-130, -130],
      [-130, 130],
      [130, 130],
      [130, -130],
      [20, -130],
      [20, -120],
      [120, -120],
      [120, 120],
      [-120, 120],
      [-120, -120],
      [-20, -120],
      [-20, -130],
      [-130, -130]
    ]
    var fenseShape = utils.makeShape(fenseCoords)

    var fenseGeometry = utils.makeExtrudeGeometry(fenseShape, 3)
    var fense = utils.makeMesh('lambert', fenseGeometry, 0xe5cabf)
    scene.add(fense)
  }

  // 添加树
  function addTrees() {
    var treesPosition = [
      [-110, -110],
      [-90, -110],
      [-70, -110],
      [-50, -110],
      [-30, -110],
      [-10, -110],
      [10, -110],
      [30, -110],
      [50, -110],
      [70, -110],
      [90, -110],
      [-110, 110],
      [-110, 90],
      [-110, 70],
      [-110, 50],
      [-110, 30],
      [-110, 10],
      [-110, -10],
      [-110, -30],
      [-110, -50],
      [-110, -70],
      [-110, -90],
      [110, 110],
      [90, 110],
      [70, 110],
      [50, 110],
      [30, 110],
      [-30, 110],
      [-50, 110],
      [-70, 110],
      [-90, 110],
      [110, -110],
      [110, -90],
      [110, -70],
      [110, -50],
      [110, -30],
      [110, -10],
      [110, 10],
      [110, 30],
      [110, 50],
      [110, 70],
      [110, 90],
    ]
    treesPosition.forEach(function(elem) {
      var x = elem[0],
        y = 1,
        z = elem[1]
      var tree = createTree(x, y, z)
      scene.add(tree)
    })
  }
  // 创造灯
  function createLamp() {
    var lamp = new THREE.Object3D()
    var pillarGeomertry = new THREE.CubeGeometry(2, 30, 2)
    pillarGeomertry.translate(0, 15, 0)
    var pillar = utils.makeMesh('phong', pillarGeomertry, 0xebd1c2)
    lamp.add(pillar)

    var connectGeometry = new THREE.CubeGeometry(10, 1, 1)
    var connect = utils.makeMesh('phong', connectGeometry, 0x2c0e0e)
    connect.position.set(3, 30, 0)
    lamp.add(connect)

    var lightGeometry = new THREE.CubeGeometry(6, 2, 4)
    light = utils.makeMesh('phong', lightGeometry, 0xebd1c2)
    light.position.set(10, 30, 0)
    lamp.add(light)

    return lamp
  }
  
  function createHospital() {
    var hospital = new THREE.Object3D()
    
    // 底座
    var baseGeometry = new THREE.BoxBufferGeometry(180, 3, 140)
    var base = utils.makeMesh('lambert', baseGeometry, 0xffffff)
    base.position.y = 1
    hospital.add(base)
    
    // 楼的主体
    var frontMainCoords = [
      [-80, -30],
      [-80, 20],
      [50, 20],
      [50, 0],
      [20, -30],
      [-80, -30]
    ]
    var frontMainShape = utils.makeShape(frontMainCoords)
    var frontMainGeometry = utils.makeExtrudeGeometry(frontMainShape, 100)
    var frontMainMaterial = new THREE.MeshPhongMaterial({ map: textures.window() })
    frontMainMaterial.map.repeat.set(0.1, 0.08)
    var frontMain = new THREE.Mesh(frontMainGeometry, frontMainMaterial)
    frontMain.castShadow = true
    frontMain.receiveShadow = true
    hospital.add(frontMain)

    // 楼顶地板
    var frontTopShape = frontMainShape
    var frontTopGeometry = utils.makeExtrudeGeometry(frontTopShape, 5)
    var frontTop = utils.makeMesh('lambert', frontTopGeometry, 0xb1a7af)
    frontTop.position.y = 100
    hospital.add(frontTop)

    // 楼顶架
    var frontRoofShelfGeometry = new THREE.Geometry()
    var frontRoofShelfCubeGeometry = new THREE.BoxGeometry(2, 2, 40)
    // for z-axis
    for (var i = 0; i < 12; i++) {
      var geometry = frontRoofShelfCubeGeometry.clone()
      geometry.translate(i * 5, 0, 0)
      frontRoofShelfGeometry.merge(geometry)
    }
    // for x-axis
    for (var i = 0; i < 2; i++) {
      var geometry = frontRoofShelfCubeGeometry.clone()
      geometry.rotateY(0.5 * Math.PI)
      geometry.scale(1.6, 1, 1)
      geometry.translate(27, 0, -15 + i * 30)
      frontRoofShelfGeometry.merge(geometry)
    }
    // for y-axis
    var frontRoofShelfCubeYPosition = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ]
    for (var i = 0; i < frontRoofShelfCubeYPosition.length; i++) {
      var p = frontRoofShelfCubeYPosition[i]
      var geometry = frontRoofShelfCubeGeometry.clone()
      geometry.scale(1, 1, 0.4)
      geometry.rotateX(0.5 * Math.PI)
      geometry.translate(p[0] * 55, 0, -15 + p[1] * 30)
      frontRoofShelfGeometry.merge(geometry)
    }
    frontRoofShelfGeometry = new THREE.BufferGeometry().fromGeometry(frontRoofShelfGeometry)
    var frontRoofShelf = utils.makeMesh('phong', frontRoofShelfGeometry, 0xffffff)
    frontRoofShelf.position.set(-70, 115, 5)
    hospital.add(frontRoofShelf)

    // 楼前的平台
    var frontPlatGeometry = new THREE.BoxBufferGeometry(150, 3, 90)
    var fronPlat = utils.makeMesh('lambert', frontPlatGeometry, 0x0792a5)
    fronPlat.position.set(-3, 18, 25)
    hospital.add(fronPlat)

    // 楼前的平台的前护栏
    var frontPlatVerticalGeometry = new THREE.BoxBufferGeometry(150, 15, 3)
    var frontPlatVertical = utils.makeMesh('phong', frontPlatVerticalGeometry, 0x0792a5)
    frontPlatVertical.receiveShadow = false
    frontPlatVertical.position.set(-3, 24, 68.5)
    hospital.add(frontPlatVertical)

    // 楼前的平台的前护栏的白色护栏块
    var frontPlatVerticalWhiteGeometry = new THREE.BoxBufferGeometry(150, 3, 3)
    var frontPlatVerticalWhite = utils.makeMesh('phong', frontPlatVerticalWhiteGeometry, 0xffffff)
    frontPlatVerticalWhite.position.set(-3, 33, 68.5)
    hospital.add(frontPlatVerticalWhite)

    // 楼前的平台的左底柱
    var frontPlatPillarGeometry = new THREE.CylinderGeometry(2, 2, 15, 32)
    var frontPlatPillar = utils.makeMesh('lambert', frontPlatPillarGeometry, 0xffffff)
    frontPlatPillar.position.set(-60, 10, 55)
    hospital.add(frontPlatPillar)

    // 楼前的平台的右底柱
    var frontPlatPillar2 = frontPlatPillar.clone()
    frontPlatPillar2.position.set(55, 10, 55)
    hospital.add(frontPlatPillar2)

    // 楼的主体骨架
    var frontBorderVerticles = new THREE.Object3D()
    var frontBorderVerticleGeometry = new THREE.BoxBufferGeometry(4, 106, 4)
    var frontBorderVerticleMesh = utils.makeMesh('phong', frontBorderVerticleGeometry, 0xffffff)
    var frontBorderVerticle1 = frontBorderVerticleMesh.clone()
    frontBorderVerticle1.position.set(-80, 52, 30)
    frontBorderVerticles.add(frontBorderVerticle1)
    var frontBorderVerticle2 = frontBorderVerticleMesh.clone()
    frontBorderVerticle2.position.set(-80, 52, -20)
    frontBorderVerticles.add(frontBorderVerticle2)
    var frontBorderVerticle3 = frontBorderVerticleMesh.clone()
    frontBorderVerticle3.position.set(50, 52, -18)
    frontBorderVerticles.add(frontBorderVerticle3)
    hospital.add(frontBorderVerticles)

    // 楼的屋顶骨架
    var frontRoofCoords = [
      [-82, -32],
      [20, -32],
      [52, 0],
      [52, 22],
      [-82, 22],
      [-82, -32]
    ]
    var frontRoofHolePath = [
      [-78, -28],
      [20, -28],
      [48, 0],
      [48, 18],
      [-78, 18],
      [-78, -28]
    ]
    var frontRoofShape = utils.makeShape(frontRoofCoords, frontRoofHolePath)
    var frontRoofGeometry = utils.makeExtrudeGeometry(frontRoofShape, 8)
    var frontRoof = utils.makeMesh('phong', frontRoofGeometry, 0xffffff)
    frontRoof.position.y = 100
    hospital.add(frontRoof)

    // 后楼的主体
    var backMainCoords = [
      [-80, 20],
      [-80, 60],
      [80, 60],
      [80, 20],
      [-80, 20]
    ]
    var backMainHolePath = [
      [-78, 22],
      [78, 22],
      [78, 58],
      [-78, 58],
      [-78, 22]
    ]
    var backMainShape = utils.makeShape(backMainCoords, backMainHolePath)

    var backMainGeometry = utils.makeExtrudeGeometry(backMainShape, 90)
    var backMain = utils.makeMesh('lambert', backMainGeometry, 0xf2e21b)
    hospital.add(backMain)

    var backMiddleCoords = [
      [0, 0],
      [36, 0],
      [36, 70],
      [0, 70],
      [0, 0]
    ]
    var backMiddleHolePath = [
      [2, 2],
      [34, 2],
      [34, 68],
      [2, 68],
      [2, 2]
    ]
    var backMiddleShape = utils.makeShape(backMiddleCoords, backMiddleHolePath)
    var backMiddkeGeometry = utils.makeExtrudeGeometry(backMiddleShape, 165)
    var backMiddle = utils.makeMesh('lambert', backMiddkeGeometry, 0xffffff)

    backMiddle.rotation.x = -0.5 * Math.PI
    backMiddle.rotation.z = -0.5 * Math.PI
    backMiddle.position.y = 86
    backMiddle.position.z = -58
    backMiddle.position.x = -78
    //hospital.add(backMiddle)

    var backMiddleWindowGeometry = new THREE.PlaneGeometry(32, 66, 1, 1)
    var backMiddleWindowMaterial = new THREE.MeshPhongMaterial({ map: textures.window() })
    backMiddleWindowMaterial.map.repeat.set(2, 6)

    var backMiddleWindow = new THREE.Mesh(backMiddleWindowGeometry, backMiddleWindowMaterial)
    backMiddleWindow.position.set(83, 51, -40)
    backMiddleWindow.rotation.y = 0.5 * Math.PI
    //hospital.add(backMiddleWindow)

    var windowBackOrigin = createWindow()
    windowBackOrigin.scale.set(0.6, 0.6, 1)
    windowBackOrigin.rotation.y = Math.PI
    windowBackOrigin.position.set(65, 75, -61)
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 4; j++) {
        var windowObj = windowBackOrigin.clone()
        windowObj.position.x -= i * 22
        windowObj.position.y -= j * 20
        //hospital.add(windowObj)
      }
    }

    return hospital
  }

  function createWindow() {
    var windowObj = new THREE.Object3D()
    var glassGeometry = new THREE.PlaneGeometry(20, 20)
    var glass = utils.makeMesh('phong', glassGeometry, 0x6a5e74)
    windowObj.add(glass)

    var windowBorderGeometry = new THREE.BoxBufferGeometry(22, 2, 2)
    var windowBorder = utils.makeMesh('phong', windowBorderGeometry, 0xffffff)

    var windowBorderTop = windowBorder.clone()
    windowBorderTop.position.y = 10
    windowObj.add(windowBorderTop)

    var windowBorderBottom = windowBorder.clone()
    windowBorderBottom.position.y = -10
    windowObj.add(windowBorderBottom)

    var windowBorderLeft = windowBorder.clone()
    windowBorderLeft.rotation.z = 0.5 * Math.PI
    windowBorderLeft.position.x = -10
    windowObj.add(windowBorderLeft)

    var windowBorderRight = windowBorderLeft.clone()
    windowBorderRight.position.x = 10
    windowObj.add(windowBorderRight)

    return windowObj
  }
  // 单体树
  function createTree(x, y, z) {
    var x = x || 0
    var y = y || 0
    var z = z || 0

    var tree = new THREE.Object3D() // 新建一个空对象用来放 树干 和 树叶 部分

    var treeTrunkGeometry = new THREE.BoxBufferGeometry(2, 16, 2) // 树干
    var treeTrunk = utils.makeMesh('lambert', treeTrunkGeometry, 0x8a613a)
    treeTrunk.position.y = 8 // 树干 y 轴位置
    tree.add(treeTrunk) // 树干添加到空对象中

    var treeLeafsGeometry = new THREE.BoxBufferGeometry(8, 8, 8) // 树叶
    var treeLeafs = utils.makeMesh('lambert', treeLeafsGeometry, 0x9c9e5d)
    treeLeafs.position.y = 13 // 树叶 y 轴的位置
    tree.add(treeLeafs) // 树叶添加到空对象中

    tree.position.set(x, y, z)

    return tree // 返回 树 = 树干 + 树叶 对象
  }
}
// 路灯
function buildLightSystem() {

  if (!config.isMobile) {
    // 平行的一束光，模拟从很远处照射的太阳光
    // DirectionalLight( color, intensity )
    // color — 光的颜色值，十六进制，默认值为0xffffff.
    // intensity — 光的强度，默认值为1.  
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
    directionalLight.position.set(0, 1000, 500);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;

    var d = 300;
    // 正交投影相机
    // var camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    directionalLight.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 500, 1600);
    directionalLight.shadow.bias = 0.0001;
    directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight)
    // 环境光( AmbientLight )：笼罩在整个空间无处不在的光
    var light = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(light)
  } else {
    // 半球光光源( HemisphereLight )
    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 1)
    scene.add(hemisphereLight)
    var light = new THREE.AmbientLight(0xffffff, 0.15)
    scene.add(light)
  }

}

function buildAuxSystem() {
  // stats = new Stats()
  // stats.setMode(0)
  // stats.domElement.style.position = 'absolute'
  // stats.domElement.style.left = '5px'
  // stats.domElement.style.top = '5px'
  // document.body.appendChild(stats.domElement)

  // var axisHelper = new THREE.AxesHelper(200)
  // scene.add(axisHelper)

  // 创建网格辅助线
  var gridHelper = new THREE.GridHelper(320, 32)
  scene.add(gridHelper)

 var controls = new THREE.OrbitControls(camera, renderer.domElement)
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true
  // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
  controls.dampingFactor = 0.25
  // 旋转速度
  controls.rotateSpeed = 0.35 
}

function carMoving(car) {
  var angle = car.mesh.rotation.y
  var x = car.mesh.position.x,
    z = car.mesh.position.z

  if (x < 145 && z === 145) {
    car.forward()
  } else if (angle < 0.5 * Math.PI) {
    car.turnLeft(0.5 * Math.PI, 0.1)
  } else if (x === 145 && z > -145) {
    car.forward()
  } else if (angle < Math.PI) {
    car.turnLeft(0.5 * Math.PI, 0.1)
  } else if (x > -145 && z == -145) {
    car.forward()
  } else if (angle < 1.5 * Math.PI) {
    car.turnLeft(0.5 * Math.PI, 0.1)
  } else if (x === -145 && z < 145) {
    car.mesh.rotation.y = 1.5 * Math.PI
    car.forward()
  } else if (angle < 2 * Math.PI) {
    car.turnLeft(0.5 * Math.PI, 0.1)
  } else {
    car.setPosition(-145, 0, 145)
    car.mesh.rotation.set(0, 0, 0)
  }
}

function loop() {
  // stats.update()
  cars.forEach(function(car) {
    carMoving(car)
  })
  renderer.render(scene, camera) // 渲染器开始渲染, scene 和 camera 是必须参数, 因为场景里有动画, 所以放在 loop 里循环
  requestAnimationFrame(loop)
}

function onWindowResize() {
  window.addEventListener('resize', function() {
    width = window.innerWidth
    height = window.innerHeight

    camera.aspect = width / height;
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  })
}