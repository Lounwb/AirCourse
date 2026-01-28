// 中国大陆主要大学信息数据库
// 说明：
// - key 使用“学校（校区）”的显示名，便于直接在输入框联想与回填
// - classTimes 若为空数组，表示暂未收录该校区的节次时间，前端应保持用户自定义 periods 不变
export const universitiesData = {
    // 985工程大学
    // 北京大学
    "北京大学（燕园校区）": {
        "address": "北京市海淀区颐和园路5号",
        "classesPerDay": null,
        "classTimes": []
    },
    "清华大学（北京校区）": {
        "address": "北京市海淀区清华园1号",
        "classesPerDay": null,
        "classTimes": []
    },
    "电子科技大学（清水河校区）": {
        "address": "成都市高新区（西区）西源大道2006号",
        "classesPerDay": 11,
        "classDuration": 45,
        "breakDuration": 15,
        "classTimes": [
            { start: "08:30", end: "09:15" },
            { start: "09:20", end: "10:05" },
            { start: "10:20", end: "11:05" },
            { start: "11:10", end: "11:55" },
            { start: "14:30", end: "15:15" },
            { start: "15:20", end: "16:05" },
            { start: "16:20", end: "17:05" },
            { start: "17:10", end: "17:55" },
            { start: "19:30", end: "20:15" },
            { start: "20:20", end: "21:05" },
            { start: "21:10", end: "21:55" }
        ]
    },
    "电子科技大学（沙河校区）": {
        "address": "成都市成华区建设北路二段4号",
        "classesPerDay": 11,
        "classDuration": 45,
        "breakDuration": 15,
        "classTimes": [
            { start: "08:30", end: "09:15" },
            { start: "09:20", end: "10:05" },
            { start: "10:20", end: "11:05" },
            { start: "11:10", end: "11:55" },
            { start: "14:30", end: "15:15" },
            { start: "15:20", end: "16:05" },
            { start: "16:20", end: "17:05" },
            { start: "17:10", end: "17:55" },
            { start: "19:30", end: "20:15" },
            { start: "20:20", end: "21:05" },
            { start: "21:10", end: "21:55" }
        ]
    },
    "电子科技大学（九里堤校区）": {
        "address": "成都市金牛区九里堤西路8号",
        "classesPerDay": 11,
        "classDuration": 45,
        "breakDuration": 15,
        "classTimes": [
            { start: "08:30", end: "09:15" },
            { start: "09:20", end: "10:05" },
            { start: "10:20", end: "11:05" },
            { start: "11:10", end: "11:55" },
            { start: "14:30", end: "15:15" },
            { start: "15:20", end: "16:05" },
            { start: "16:20", end: "17:05" },
            { start: "17:10", end: "17:55" },
            { start: "19:30", end: "20:15" },
            { start: "20:20", end: "21:05" },
            { start: "21:10", end: "21:55" }
        ]
    },
    // 四川大学
    "四川大学（望江校区）": {
        "address": "成都市武侯区一环路南一段24号",
        "classesPerDay": 12,
        "classDuration": 45,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:00", end: "08:45" },
            { start: "08:55", end: "09:40" },
            { start: "10:00", end: "10:45" },
            { start: "10:55", end: "11:40" },
            { start: "14:00", end: "14:45" },
            { start: "14:55", end: "15:40" },
            { start: "15:50", end: "16:35" },
            { start: "16:55", end: "17:40" },
            { start: "17:50", end: "18:35" },
            { start: "19:30", end: "20:15" },
            { start: "20:25", end: "21:10" },
            { start: "21:20", end: "22:05" }
        ]
    },
    "四川大学（华西校区）": {
        "address": "成都市武侯区人民南路三段17号",
        "classesPerDay": 12,
        "classDuration": 45,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:00", end: "08:45" },
            { start: "08:55", end: "09:40" },
            { start: "10:00", end: "10:45" },
            { start: "10:55", end: "11:40" },
            { start: "14:00", end: "14:45" },
            { start: "14:55", end: "15:40" },
            { start: "15:50", end: "16:35" },
            { start: "16:55", end: "17:40" },
            { start: "17:50", end: "18:35" },
            { start: "19:30", end: "20:15" },
            { start: "20:25", end: "21:10" },
            { start: "21:20", end: "22:05" }
        ]
    },
    "四川大学（江安校区）": {
        "address": "成都市双流区川大路二段2号",
        "classesPerDay": 12,
        "classDuration": 45,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:15", end: "09:00" },
            { start: "09:10", end: "09:55" },
            { start: "10:15", end: "11:00" },
            { start: "11:10", end: "11:55" },
            { start: "13:50", end: "14:35" },
            { start: "14:45", end: "15:30" },
            { start: "15:40", end: "16:25" },
            { start: "16:45", end: "17:30" },
            { start: "17:40", end: "18:25" },
            { start: "19:20", end: "20:05" },
            { start: "20:15", end: "21:00" },
            { start: "21:10", end: "21:55" }
        ]
    },
    "中国矿业大学（南湖校区）": {
        "address": "江苏省徐州市铜山区大学路1号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中国矿业大学（文昌校区）": {
        "address": "江苏省徐州市泉山区金山东路1号",
        "classesPerDay": null,
        "classTimes": []
    },
    "大连理工大学（主校区）": {
        "address": "辽宁省大连市甘井子区凌工路2号",
        "classesPerDay": null,
        "classTimes": []
    },
    "大连理工大学（开发区校区）": {
        "address": "辽宁省大连市金普新区图强路321号",
        "classesPerDay": null,
        "classTimes": []
    },
    "大连理工大学（盘锦校区）": {
        "address": "辽宁省盘锦市辽东湾新区大工路2号",
        "classesPerDay": null,
        "classTimes": []
    },
    // 山东大学
    "山东大学（中心校区）": {
        "address": "山东省济南市历城区山大南路27号",
        "classesPerDay": 12,
        "classDuration": 50,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:00", end: "08:50" },
            { start: "09:00", end: "10:50" },
            { start: "10:10", end: "11:00" },
            { start: "11:10", end: "12:00" },
            { start: "14:00", end: "14:50" },
            { start: "15:00", end: "15:50" },
            { start: "16:10", end: "17:00" },
            { start: "17:10", end: "18:00" },
            { start: "19:00", end: "19:50" },
            { start: "20:00", end: "20:50" },
            { start: "21:10", end: "22:00" },
            { start: "22:10", end: "23:00" }
        ]
    },
    "山东大学（威海校区）": {
        "address": "山东省威海市文化西路180号",
        "classesPerDay": 12,
        "classDuration": 50,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:00", end: "08:50" },
            { start: "09:00", end: "10:50" },
            { start: "10:10", end: "11:00" },
            { start: "11:10", end: "12:00" },
            { start: "14:00", end: "14:50" },
            { start: "15:00", end: "15:50" },
            { start: "16:10", end: "17:00" },
            { start: "17:10", end: "18:00" },
            { start: "19:00", end: "19:50" },
            { start: "20:00", end: "20:50" },
            { start: "21:10", end: "22:00" },
            { start: "22:10", end: "23:00" }
        ]
    },
    "山东大学（青岛校区）": {
        "address": "山东省青岛市即墨区滨海路72号",
        "classesPerDay": 12,
        "classDuration": 50,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:00", end: "08:50" },
            { start: "09:00", end: "10:50" },
            { start: "10:10", end: "11:00" },
            { start: "11:10", end: "12:00" },
            { start: "14:00", end: "14:50" },
            { start: "15:00", end: "15:50" },
            { start: "16:10", end: "17:00" },
            { start: "17:10", end: "18:00" },
            { start: "19:00", end: "19:50" },
            { start: "20:00", end: "20:50" },
            { start: "21:10", end: "22:00" },
            { start: "22:10", end: "23:00" }
        ]
    },
    "山东大学（软件园校区）": {
        "address": "山东省济南市历下区舜华路1500号",
        "classesPerDay": 12,
        "classDuration": 50,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:00", end: "08:50" },
            { start: "09:00", end: "10:50" },
            { start: "10:10", end: "11:00" },
            { start: "11:10", end: "12:00" },
            { start: "14:00", end: "14:50" },
            { start: "15:00", end: "15:50" },
            { start: "16:10", end: "17:00" },
            { start: "17:10", end: "18:00" },
            { start: "19:00", end: "19:50" },
            { start: "20:00", end: "20:50" },
            { start: "21:10", end: "22:00" },
            { start: "22:10", end: "23:00" }
        ]
    },
    "山东大学（洪家楼校区）": {
        "address": "山东省济南市历城区洪家楼5号",
        "classesPerDay": 12,
        "classDuration": 50,
        "breakDuration": 20,
        "classTimes": [
            { start: "08:00", end: "08:50" },
            { start: "09:00", end: "10:50" },
            { start: "10:10", end: "11:00" },
            { start: "11:10", end: "12:00" },
            { start: "14:00", end: "14:50" },
            { start: "15:00", end: "15:50" },
            { start: "16:10", end: "17:00" },
            { start: "17:10", end: "18:00" },
            { start: "19:00", end: "19:50" },
            { start: "20:00", end: "20:50" },
            { start: "21:10", end: "22:00" },
            { start: "22:10", end: "23:00" }
        ]
    },
    "北京师范大学（北京校区）": {
        "address": "北京市海淀区新街口外大街19号",
        "classesPerDay": null,
        "classTimes": []
    },
    "北京师范大学（珠海校区）": {
        "address": "广东省珠海市香洲区唐家湾金凤路18号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中山大学（广州南校园）": {
        "address": "广州市海珠区新港西路135号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中山大学（珠海校区）": {
        "address": "珠海市香洲区唐家湾大学路2号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中山大学（深圳校区）": {
        "address": "深圳市光明区公常路66号",
        "classesPerDay": null,
        "classTimes": []
    },
    "华南理工大学（五山校区）": {
        "address": "广州市天河区五山路381号",
        "classesPerDay": null,
        "classTimes": []
    },
    "华南理工大学（大学城校区）": {
        "address": "广州市番禺区广州大学城外环东路382号",
        "classesPerDay": null,
        "classTimes": []
    },
    "华南理工大学（广州国际校区）": {
        "address": "广州市番禺区兴业大道东777号",
        "classesPerDay": null,
        "classTimes": []
    },
    "西安交通大学（兴庆校区）": {
        "address": "西安市碑林区咸宁西路28号",
        "classesPerDay": null,
        "classTimes": []
    },
    "西安交通大学（雁塔校区）": {
        "address": "西安市雁塔区雁塔西路76号",
        "classesPerDay": null,
        "classTimes": []
    },
    "西安交通大学（曲江校区）": {
        "address": "西安市雁塔区雁翔路99号",
        "classesPerDay": null,
        "classTimes": []
    },
    "西安交通大学（苏州研究院）": {
        "address": "苏州市工业园区独墅湖科教创新区仁爱路99号",
        "classesPerDay": null,
        "classTimes": []
    },
    "西北工业大学（友谊校区）": {
        "address": "西安市碑林区友谊西路127号",
        "classesPerDay": null,
        "classTimes": []
    },
    "西北工业大学（长安校区）": {
        "address": "西安市长安区东大镇东大村",
        "classesPerDay": null,
        "classTimes": []
    },
    "中国地质大学（武汉）（南望山校区）": {
        "address": "湖北省武汉市洪山区鲁磨路388号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中国地质大学（武汉）（未来城校区）": {
        "address": "湖北省武汉市东湖新技术开发区锦程街68号",
        "classesPerDay": null,
        "classTimes": []
    },
    "北京理工大学（中关村校区）": {
        "address": "北京市海淀区中关村南大街5号",
        "classesPerDay": null,
        "classTimes": []
    },
    "北京理工大学（良乡校区）": {
        "address": "北京市房山区良乡高教园区",
        "classesPerDay": null,
        "classTimes": []
    },
    "北京理工大学（珠海校区）": {
        "address": "广东省珠海市唐家湾金凤路6号",
        "classesPerDay": null,
        "classTimes": []
    },
    "浙江大学（紫金港校区）": {
        "address": "浙江省杭州市西湖区余杭塘路866号",
        "classesPerDay": null,
        "classTimes": []
    },
    "浙江大学（玉泉校区）": {
        "address": "浙江省杭州市西湖区浙大路38号",
        "classesPerDay": null,
        "classTimes": []
    },
    "清华大学（深圳国际研究生院）": {
        "address": "深圳市南山区西丽大学城清华园区",
        "classesPerDay": null,
        "classTimes": []
    },
    "北京大学（深圳研究生院）": {
        "address": "深圳市南山区西丽镇丽水路2199号",
        "classesPerDay": null,
        "classTimes": []
    },
    "哈尔滨工业大学（深圳）": {
        "address": "深圳市南山区桃源街道深圳大学城哈尔滨工业大学校区",
        "classesPerDay": null,
        "classTimes": []
    },
    "西安交通大学（创新港校区）": {
        "address": "西安市长安区学森一路中国西部科技创新港1号巨构2096",
        "classesPerDay": null,
        "classTimes": []
    },
    "南京大学（苏州校区）": {
        "address": "苏州市高新区太湖大道1520号",
        "classesPerDay": null,
        "classTimes": []
    },
    "武汉大学（医学部校区）": {
        "address": "湖北省武汉市武昌区东湖路115号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中国矿业大学（北京）（沙河校区）": {
        "address": "北京市昌平区沙河高教园区南二街9号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中国石油大学（华东）（古镇口校区）": {
        "address": "山东省青岛市黄岛区海军路6号",
        "classesPerDay": null,
        "classTimes": []
    },
    "合肥工业大学（宣城校区）": {
        "address": "安徽省宣城市宣州区薰化路301号",
        "classesPerDay": null,
        "classTimes": []
    },
    "武汉理工大学（余家头校区）": {
        "address": "武汉市武昌区和平大道1178号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中山大学（深圳校区）": {
        "address": "深圳市光明区公常路66号",
        "classesPerDay": null,
        "classTimes": []
    },
    "复旦大学（张江校区）": {
        "address": "上海市浦东新区张衡路825号",
        "classesPerDay": null,
        "classTimes": []
    },
    "上海交通大学（闵行校区）": {
        "address": "上海市闵行区东川路800号",
        "classesPerDay": null,
        "classTimes": []
    },
    "北京交通大学（威海校区）": {
        "address": "山东省威海市南海新区现代路69号",
        "classesPerDay": null,
        "classTimes": []
    },
    "南京理工大学（江阴校区）": {
        "address": "江苏省无锡市江阴市福星路8号",
        "classesPerDay": null,
        "classTimes": []
    },
    "华北电力大学（保定校区）": {
        "address": "河北省保定市莲池区永华北大街619号",
        "classesPerDay": null,
        "classTimes": []
    },
    "北京邮电大学（沙河校区）": {
        "address": "北京市昌平区沙河高教园区南三街",
        "classesPerDay": null,
        "classTimes": []
    },
    "华中科技大学（同济医学院）": {
        "address": "武汉市江汉区航空路13号",
        "classesPerDay": null,
        "classTimes": []
    },
    "中国科学院大学（雁栖湖校区）": {
        "address": "北京市怀柔区雁栖湖东路1号",
        "classesPerDay": 13,
        "classDuration": 45,
        "breakDuration": 15,
        "classTimes": [
            { start: "08:30", end: "09:15" },
            { start: "09:20", end: "10:05" },
            { start: "10:25", end: "11:10" },
            { start: "11:15", end: "12:00" },
            { start: "13:30", end: "14:15" },
            { start: "14:20", end: "15:05" },
            { start: "15:25", end: "16:10" },
            { start: "16:15", end: "17:00" },
            { start: "17:05", end: "17:50" },
            { start: "18:30", end: "19:15" },
            { start: "19:20", end: "20:05" },
            { start: "20:15", end: "21:00" },
            { start: "21:05", end: "21:50" }
        ]
    },
    "中国科学院大学（玉泉路校区）": {
        "address": "北京市石景山区玉泉路（甲）19号",
        "classesPerDay": 13,
        "classDuration": 45,
        "breakDuration": 15,
        "classTimes": [
            { start: "08:30", end: "09:15" },
            { start: "09:20", end: "10:05" },
            { start: "10:25", end: "11:10" },
            { start: "11:15", end: "12:00" },
            { start: "13:30", end: "14:15" },
            { start: "14:20", end: "15:05" },
            { start: "15:25", end: "16:10" },
            { start: "16:15", end: "17:00" },
            { start: "17:05", end: "17:50" },
            { start: "18:30", end: "19:15" },
            { start: "19:20", end: "20:05" },
            { start: "20:15", end: "21:00" },
            { start: "21:05", end: "21:50" }
        ]
    },
    "中国科学院大学（中关村校区）": {
        "address": "北京市海淀区中关村东路80号",
        "classesPerDay": 13,
        "classDuration": 45,
        "breakDuration": 15,
        "classTimes": [
            { start: "08:30", end: "09:15" },
            { start: "09:20", end: "10:05" },
            { start: "10:25", end: "11:10" },
            { start: "11:15", end: "12:00" },
            { start: "13:30", end: "14:15" },
            { start: "14:20", end: "15:05" },
            { start: "15:25", end: "16:10" },
            { start: "16:15", end: "17:00" },
            { start: "17:05", end: "17:50" },
            { start: "18:30", end: "19:15" },
            { start: "19:20", end: "20:05" },
            { start: "20:15", end: "21:00" },
            { start: "21:05", end: "21:50" }
        ]
    },
    "中国科学院大学（奥运村校区）": {
        "address": "北京市朝阳区大屯路3号",
        "classesPerDay": 13,
        "classDuration": 45,
        "breakDuration": 15,
        "classTimes": [
            { start: "08:30", end: "09:15" },
            { start: "09:20", end: "10:05" },
            { start: "10:25", end: "11:10" },
            { start: "11:15", end: "12:00" },
            { start: "13:30", end: "14:15" },
            { start: "14:20", end: "15:05" },
            { start: "15:25", end: "16:10" },
            { start: "16:15", end: "17:00" },
            { start: "17:05", end: "17:50" },
            { start: "18:30", end: "19:15" },
            { start: "19:20", end: "20:05" },
            { start: "20:15", end: "21:00" },
            { start: "21:05", end: "21:50" }
        ]
    },
    "香港中文大学（主校区）": {
        "address": "香港新界沙田小沥源源顺围7号",
        "classesPerDay": null
    },
    "香港中文大学（深圳校区）": {
        "address": "广东省深圳市龙岗区龙翔大道2001号",
        "classesPerDay": null
    },
    // 海南大学
    "海南大学（海甸校区）": {
        "address": "海南省海口市美兰区人民大道58号",
        "classesPerDay": 11,
        "classTimes": [
            { start: "07:40", end: "08:25" },
            { start: "08:35", end: "09:20" },
            { start: "09:45", end: "10:30" },
            { start: "10:40", end: "11:25" },
            { start: "14:30", end: "15:15" },
            { start: "15:25", end: "16:10" },
            { start: "16:35", end: "17:20" },
            { start: "17:30", end: "18:15" },
            { start: "19:20", end: "20:05" },
            { start: "20:15", end: "21:00" },
            { start: "21:10", end: "21:55" }
        ]
    },
    "海南大学（城西校区）": {
        "address": "海南省海口市龙华区城西路3号",
        "classesPerDay": 11,
        "classTimes": [
            { start: "07:40", end: "08:25" },
            { start: "08:35", end: "09:20" },
            { start: "09:45", end: "10:30" },
            { start: "10:40", end: "11:25" },
            { start: "14:30", end: "15:15" },
            { start: "15:25", end: "16:10" },
            { start: "16:35", end: "17:20" },
            { start: "17:30", end: "18:15" },
            { start: "19:20", end: "20:05" },
            { start: "20:15", end: "21:00" },
            { start: "21:10", end: "21:55" }
        ]
    }
};

export default universitiesData;
