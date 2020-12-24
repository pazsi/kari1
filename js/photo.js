import * as THREE from '/three.module.js';

import { DDSLoader } from '/loaders/DDSLoader.js';
import { MTLLoader } from '/loaders/MTLLoader.js';
import { OBJLoader } from '/loaders/OBJLoader.js';

let camera, scene, renderer, group, isMouseDown = false, stars, geometry, material, mouseX, numberOfImages = 20;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 600);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //path
  var path = new THREE.Group();
  for (var i = 0; i < 2000; i++) {
    geometry = new THREE.SphereBufferGeometry();
    material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var point = new THREE.Mesh(geometry, material);
    point.position.x = (Math.random() - 0.5) * 90;
    point.position.y = -30;
    point.position.z = (Math.random()) * 10 * numberOfImages * -50;
    path.add(point);
  }
  scene.add(path);
  render();

  //add stars
  stars = new THREE.Group();
  for (var i = 0; i < 1000; i++) {
    geometry = new THREE.SphereBufferGeometry();
    material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var star = new THREE.Mesh(geometry, material);
    star.position.x = (Math.random() - 0.5) * 1000;
    star.position.y = (Math.random() - 0.5) * 1000;
    star.position.z = (Math.random()) * 10 * numberOfImages * -50 - 50;
    //star.position.z= 90;
    stars.add(star);
  }
  scene.add(stars);
  render();

  // add pic
  var pic;
  group = new THREE.Group();
  geometry = new THREE.BoxBufferGeometry(40, 30, 0.1);
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  pic = new THREE.Mesh(geometry, material);
  THREE.ImageUtils.crossOrigin = true;
  var textureLoader = new THREE.TextureLoader();
  for (var i = 1; i <= numberOfImages; i++) {
    material = new THREE.MeshBasicMaterial({
      map: textureLoader.load('js/textures/0 (' + i + ').JPG'),
    });
    pic = new THREE.Mesh(geometry, material);
    if (i % 2) {
      pic.rotation.y = -90;
      pic.position.x = -50;
    }
    else {
      pic.rotation.y = 90;
      pic.position.x = 50;
    }
    pic.position.z = i * -50;
    pic.matrixAutoUpdate = false;
    pic.updateMatrix();

    //pic.addEventListener('click', onclick, false);

    group.add(pic);

    scene.add(group);
    render();
  }


  camera.position.z = 70;
  //camera.position.z = -50 * numberOfImages + 50;

  // so many lights
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 0);
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(0, -1, 0);
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 0, 0);
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(0, 0, 1);
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, -1);
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(-1, 0, 0);
  scene.add(light);

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  window.addEventListener('wheel', onwheel, false);

  const onProgress = function (xhr) {

    if (xhr.lengthComputable) {

      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');

    }

  };

  //tree
  const onError = function () { };

  const manager = new THREE.LoadingManager();
  manager.addHandler(/\.dds$/i, new DDSLoader());

  new MTLLoader(manager)
    .setPath('js/textures/tree/')
    .load('12150_Christmas_Tree_V2_L2.mtl', function (materials) {

      materials.preload();

      new OBJLoader(manager)
        .setMaterials(materials)
        .setPath('js/textures/tree/')
        .load('12150_Christmas_Tree_V2_L2.obj', function (object) {

          object.position.z = -50 * numberOfImages - 500;
          object.position.y -= 30
          object.rotation.x -= Math.PI / 2;
          scene.add(object);

        }, onProgress, onError);

    });

  //felirat
  material = new THREE.MeshBasicMaterial({ color: 0xfdfd96 });

  const loader = new THREE.FontLoader();

  loader.load('js/fonts/helvetiker_regular.typeface.json', (font) => {
    geometry = new THREE.TextBufferGeometry('Merry   Xmas!', {
      font: font,
      size: 50,  
  
      height: 3,  
  
      curveSegments: 20,  
  
      bevelEnabled: true,  
      bevelThickness: 0.5,  
  
      bevelSize: 0.1,  
  
      bevelSegments: 10,  
  
    });
    
    let text = new THREE.Mesh(geometry, material);
    text.position.x=-200;
    text.position.z = -50 * numberOfImages - 650;
    text.position.y = 100;
    text.rotation.y = 0.2;
    scene.add(text);
    render();

  });

}

init();
render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 87: camera.position.z -= 1; break;
    case 83: camera.position.z += 1; break;
    case 65:
      if (camera.rotation.y < Math.PI / 2) {
        camera.rotation.y += 0.01;
      }
      break;
    case 68:
      if (camera.rotation.y > -Math.PI / 2) {
        camera.rotation.y -= 0.01;
      }
      break;
    case 38: camera.position.z -= 1; break;
    case 40: camera.position.z += 1; break;
    case 37:
      if (camera.rotation.y < Math.PI / 2) {
        camera.rotation.y += 0.01;
      }
      break;
    case 39:
      if (camera.rotation.y > -Math.PI / 2) {
        camera.rotation.y -= 0.01;
      }
      break;
  }
  if (camera.position.z > 70) {
    camera.position.z = 70;
  }
  if (camera.position.z < -50 * numberOfImages + 50) {
    if (camera.position.z > -50 * numberOfImages - 150) {
      camera.position.y -= event.deltaY * 0.01;
    }
    else {
      camera.position.z = -50 * numberOfImages - 150;
    }
  }
}

function onDocumentMouseDown(event) {
  isMouseDown = true;
  mouseX = event.clientX;
}

function onDocumentMouseUp(event) {
  isMouseDown = false;
}

function onDocumentMouseMove(event) {
  if (isMouseDown) {
    if (mouseX - event.clientX < 0 && camera.rotation.y < Math.PI / 2) {
      camera.rotation.y -= 0.001 * (mouseX - event.clientX);
    }
    else if (mouseX - event.clientX > 0 && camera.rotation.y > -Math.PI / 2) {
      camera.rotation.y -= 0.001 * (mouseX - event.clientX);
    }
    mouseX = event.clientX;
    //camera.rotation.y = Math.cos(mouseX-event.clientX)*0.5;
  }
}

function onwheel(event) {
  camera.position.z += event.deltaY * 0.05;
  if (camera.position.z > 70) {
    camera.position.z = 70;
  }
  if (camera.position.z < -50 * numberOfImages + 50) {
    if (camera.position.z > -50 * numberOfImages - 150) {
      camera.position.y -= event.deltaY * 0.01;
    }
    else {
      camera.position.z = -50 * numberOfImages - 150;
    }
  }
}

//function onclick(event) {
/*var geometry = new THREE.BoxBufferGeometry(40, 30, 0.1);
var textureLoader = new THREE.TextureLoader();
var material = new THREE.MeshBasicMaterial({
  map: textureLoader.load('js/textures/0 (' + index + ').JPG'),
});
var bigPic = new THREE.Mesh(geometry, material);*/
  //bigPic.addEventListener('click', onclickBig, false);
  //var bigPic = event.relatedTarget;
  //scene.add(bigPic);
  //render();
//}

/*function onclickBig( event ){
  scene.remove(bigPic);
}*/
