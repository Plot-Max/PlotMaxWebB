import Vue from "vue";

Vue.prototype.formatterPrice = (number, precistion) => {
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // 最小小数位数
        maximumFractionDigits: precistion || 2,  // 最大小数位数
        currencyDisplay: 'code' // 使用货币符号，如 $
    })
    return format.format(number).replace('USD', '').trim();
};
Vue.prototype.formatterArea = (str) => {
    if(!str) str == 0
    let size = parseFloat(str)
    
    size = parseFloat(str)
    if(size <= 10890) {
        return Math.round(size) + ' sqft'
    }
    else {
        return (size/43560).toFixed(2) + ' acre'
    }
}

const lotSizeMinOptions = [
    { label: '1,000 sqft', value: 1000 },
    { label: '2,000 sqft', value: 2000 },
    { label: '3,000 sqft', value: 3000 },
    { label: '4,000 sqft', value: 4000 },
    { label: '5,000 sqft', value: 5000 },
    { label: '7,000 sqft', value: 7000 },
    { label: '0.25 acre(10,890 sqft)', value: 10890 },
    { label: '0.5 acre', value: 21780 },
    { label: '1 acre', value: 43560 },
    { label: '1.5 acre', value: 65340 },
    { label: '2 acre', value: 87120 },
    { label: '5 acre', value: 217800 },
    { label: '10 acre', value: 435600 },
    { label: '20 acre', value: 871200 },
    { label: '50 acre', value: 2178000 },
    { label: '100 acre', value: 4356000 },
]
const frontageOptions = [
    { label: '50 ft', value: 50 },
    { label: '80 ft', value: 80 },
    { label: '100 ft', value: 100 },
    { label: '150 ft', value: 150 },
    { label: '200 ft', value: 200 },
    { label: '250 ft', value: 250 },
    { label: '300 ft', value: 300 },
    { label: '350 ft', value: 350 },
    { label: '400 ft', value: 400 },
    { label: '500 ft', value: 500 },
    { label: '700 ft', value: 700 },
    { label: '1,000 ft', value: 1000 },
]
const buildableSizeOptions = [
    { label: '1,000 sqft', value: 1000 },
    { label: '2,000 sqft', value: 2000 },
    { label: '3,000 sqft', value: 3000 },
    { label: '4,000 sqft', value: 4000 },
    { label: '5,000 sqft', value: 5000 },
    { label: '7,000 sqft', value: 7000 },
    { label: '0.25 acre(10,890 sqft)', value: 10890 },
    { label: '0.5 acre', value: 21780 },
    { label: '1 acre', value: 43560 },
    { label: '1.5 acre', value: 65340 },
    { label: '2 acre', value: 87120 },
    { label: '5 acre', value: 217800 },
    { label: '10 acre', value: 435600 },
    { label: '20 acre', value: 871200 },
    { label: '50 acre', value: 2178000 },
    { label: '100 acre', value: 4356000 },

]
const footPrintOptions = [
    { label: '1,000 sqft', value: 1000 },
    { label: '2,000 sqft', value: 2000 },
    { label: '3,000 sqft', value: 3000 },
    { label: '4,000 sqft', value: 4000 },
    { label: '5,000 sqft', value: 5000 },
    { label: '7,000 sqft', value: 7000 },
    { label: '0.25 acre(10,890 sqft)', value: 10890 },
    { label: '0.5 acre', value: 21780 },
    { label: '1 acre', value: 43560 },
    { label: '1.5 acre', value: 65340 },
    { label: '2 acre', value: 87120 },
    { label: '5 acre', value: 217800 },
    { label: '10 acre', value: 435600 },
    { label: '20 acre', value: 871200 },
    { label: '50 acre', value: 2178000 },
    { label: '100 acre', value: 4356000 },

]
const grossFloorAreaOptions = [
    { label: '500 sqft', value: 500 },
    { label: '750 sqft', value: 750 },
    { label: '1,000 sqft', value: 1000 },
    { label: '1,250 sqft', value: 1250 },
    { label: '1,500 sqft', value: 1500 },
    { label: '1,750 sqft', value: 1750 },
    { label: '2,000 sqft', value: 2000 },
    { label: '2,500 sqft', value: 2500 },
    { label: '3,000 sqft', value: 3000 },
    { label: '4,000 sqft', value: 4000 },
    { label: '5,000 sqft', value: 5000 },
    { label: '7,500 sqft', value: 7500 },
]
Vue.prototype.formatSearchParams = function(params) {
    const array = [];
    if(!params.city && params.city.length>0) {
        array.push(params.city)
    }
    if(params.lot_size_min && params.lot_size_max) {
        array.push(`Lot Size: ${getLotSizeLable(params.lot_size_min)} - ${getLotSizeLable(params.lot_size_max)}`)
    }
    else if(params.lot_size_min && params.lot_size_min != 0)  {
        array.push(`Lot Size: > ${getLotSizeLableparams.lot_size_min}`)
    }
    else if(params.lot_size_max && params.lot_size_max <= 4356000) {
        array.push(`Lot Size: < ${getLotSizeLable(params.lot_size_max)}`)
    }
    if(params.frontage_min && params.frontage_max) {
        array.push(`Frontage: ${getFrontageLable(params.frontage_min)} - ${getFrontageLable(params.frontage_max)}`)
    }
    else if(params.frontage_min && params.frontage_min != 0) {
        array.push(`Frontage: > ${getFrontageLable(params.frontage_min)}`)
    }
    else if(params.frontage_max && params.frontage_max <= 1000) {
        array.push(`Frontage: < ${getFrontageLable(params.frontage_max)}`)
    }
    if(params.buildable_min && params.buildable_max) {
        array.push(`Buildable Size: ${getBuildableSizeLable(params.buildable_min)} - ${getBuildableSizeLable(params.buildable_max)}`)
    }
    else if(params.buildable_min && params.buildable_min != 0) {
        array.push(`Buildable Size: > ${getBuildableSizeLable(params.buildable_min)}`)
    }
    else if(params.buildable_max && params.buildable_max <= 4356000) {
        array.push(`Buildable Size: < ${getBuildableSizeLable(params.buildable_max)}`)
    }
    else if(params.gfa_min && params.gfa_max) {
        array.push(`Gross Floor Area: ${getGrossFloorAreaLable(params.gfa_min)} - ${getGrossFloorAreaLable(params.gfa_max)}`)
    }
    else if(params.gfa_min && params.gfa_min != 0) {
        array.push(`Gross Floor Area: > ${getGrossFloorAreaLable(params.gfa_min)}`)
    }
    else if(params.gfa_max && params.gfa_max <= 4356000) {
        array.push(`Gross Floor Area: < ${getGrossFloorAreaLable(params.gfa_max)}`)
    }
    if(params.footprint_min && params.footprint_max) {
        array.push(`Foot Print Size: ${getFootPrintLable(params.footprint_min)} - ${getFootPrintLable(params.footprint_max)}`)
    }
    else if(params.footprint_min && params.footprint_min != 0) {
        array.push(`Foot Print Size: > ${getFootPrintLable(params.footprint_min)}`)
    }
    else if(params.footprint_max && params.footprint_max <= 4356000) {
        array.push(`Foot Print Size: < ${getFootPrintLable(params.footprint_max)}`)
    }

    if(params.has_history==null || params.has_history==false) {
        array.push('Not Historic Building')
    }
    if(params.in_history == null || params.in_history==false) {
        array.push('Not Part Of Historic District')
    }
    return array.join(', ');
}
Vue.prototype.formatSearchFormParams = function(params) {
    return {
        lot_size_min: params.lot_size_min == 0 ? null : parseFloat(params.lot_size_min),
        lot_size_max: params.lot_size_max > 4356000 ? null : parseFloat(params.lot_size_max),
        frontage_min: params.frontage_min == 0 ? null : parseFloat(params.frontage_min),
        frontage_max: params.frontage_max > 1000 ? null : parseFloat(params.frontage_max),
        buildableSize_min: params.buildable_min == 0 ? null : parseFloat(params.buildable_min),
        buildableSize_max: params.buildable_max > 4356000 ? null : parseFloat(params.buildable_max),
        gfa_min: params.gfa_min == 0 ? null : parseFloat(params.gfa_min),
        gfa_max: params.gfa_max > 7500 ? null : parseFloat(params.gfa_max),
        footprint_min: params.footprint_min == 0 ? null : parseFloat(params.footprint_min),
        footprint_max: params.footprint_max > 4356000 ? null : parseFloat(params.footprint_max),
        notHistoric: params.has_history == null ? null : !params.has_history,
        notPartOfHistoric: params.in_history == null ? null : params.in_history === 'false' ? true : false,
    }
}

function getLotSizeLable(value) {
    if(value == 0) return 'No Min'
    const option = lotSizeMinOptions.find(opt => opt.value === value);
    return option ? option.label : value > 4356000 ? 'No Max' : 'unknown';
}
function getFrontageLable(value) {
    if(value == 0) return 'No Min'
    const option = frontageOptions.find(opt => opt.value === value);
    return option ? option.label : value > 1000 ? 'No Max' : 'unknown';
}
function getBuildableSizeLable(value) {
    if(value == 0) return 'No Min'
    const option = buildableSizeOptions.find(opt => opt.value === value);
    return option ? option.label : value > 4356000 ? 'No Max' : 'unknown';
}
function getFootPrintLable(value) {
    if(value == 0) return 'No Min'
    const option = footPrintOptions.find(opt => opt.value === value);
    return option ? option.label : value > 4356000 ? 'No Max' : 'unknown';
}
function getGrossFloorAreaLable(value) {
    if(value == 0) return 'No Min'
    const option = grossFloorAreaOptions.find(opt => opt.value === value);
    return option ? option.label : value > 7500 ? 'No Max' : 'unknown';
}