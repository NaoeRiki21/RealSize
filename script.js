let deviceData = {};

// 1. 加载 JSON 数据
fetch('devices.json')
    .then(res => res.json())
    .then(data => {
        deviceData = data;
        updateDeviceList('phone'); // 默认加载手机
    });

const typeSelect = document.getElementById('typeSelect');
const deviceSelect = document.getElementById('deviceSelect');
const addBtn = document.getElementById('addBtn');
const canvas = document.getElementById('canvas');
const zoomRange = document.getElementById('zoomRange');
const zoomVal = document.getElementById('zoomVal');

// 2. 切换设备类型时更新下拉列表
typeSelect.addEventListener('change', (e) => {
    updateDeviceList(e.target.value);
});

function updateDeviceList(type) {
    const list = deviceData[type];
    deviceSelect.innerHTML = list.map((d, index) => 
        `<option value="${index}">${d.n}</option>`
    ).join('');
}

// 3. 添加设备到画布
addBtn.addEventListener('click', () => {
    const type = typeSelect.value;
    const index = deviceSelect.value;
    const device = deviceData[type][index];

    createDeviceUI(device);
});

function createDeviceUI(device) {
    const wrapper = document.createElement('div');
    wrapper.className = 'device-wrapper';

    // 计算缩放 (校准用)
    const scale = zoomRange.value / 100;

    // 创建机身
    // 注意：这里 w 和 h 直接映射到物理 mm 单位
    const body = document.createElement('div');
    body.className = 'device-body';
    body.style.width = `${device.w * scale}mm`;
    body.style.height = `${device.h * scale}mm`;
    body.style.borderRadius = `${device.br}px`;

    // 创建屏幕
    const screen = document.createElement('div');
    screen.className = 'device-screen';
    // 简化处理：屏幕比机身略小
    screen.style.width = `calc(100% - 4mm)`;
    screen.style.height = `calc(100% - 4mm)`;
    screen.style.borderRadius = `${device.sr}px`;

    // 信息标签
    const info = document.createElement('div');
    info.className = 'device-info';
    info.innerHTML = `${device.n}<br><small>${device.w} x ${device.h} mm</small>`;

    body.appendChild(screen);
    wrapper.appendChild(body);
    wrapper.appendChild(info);
    
    // 点击移除功能
    wrapper.onclick = () => wrapper.remove();

    canvas.appendChild(wrapper);
}

// 4. 校准缩放逻辑
zoomRange.addEventListener('input', (e) => {
    const val = e.target.value;
    zoomVal.innerText = val + '%';
    // 刷新画布上所有设备的尺寸
    document.querySelectorAll('.device-wrapper').forEach(el => el.remove());
    alert("校准已更改，请重新添加设备查看效果");
});

document.getElementById('clearBtn').onclick = () => canvas.innerHTML = '';
