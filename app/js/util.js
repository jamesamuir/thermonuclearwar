/**
 * Created with JetBrains WebStorm.
 * User: US084134
 * Date: 2/20/13
 * Time: 2:11 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Replaces single spaces with + symbols for rest api
 *
 */

function formatAddressString(address){
    return address.split(' ').join('+');
}


/**
 * Created with JetBrains WebStorm.
 * User: JMUIR
 * Date: 2/20/13
 * Time: 2:11 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Pulled from GroundZero
 *
 */
// crude and fast function to compensate for the earth's funny shape
function kmToDegX(kms, lat) {
    lat = Math.abs(lat);
    return (kms / (111.12 + (lat * 2.25 ))); }
function kmToDegY(kms) {
    return (kms / 111.12); }

// sourced and inspired by www.fas.org and wikipedia.org
function ba(kt, burns)	{
    var A = 1, B = 1;
    if (burns==1) {A=0.38;B=1.20};
    if (burns==2) {A=0.40;B=0.87};
    if (burns==3) {A=0.34;B=0.67};
    if (burns==4) {A=0.30;B=0.55};
    return Math.pow(kt,A) * B;	}

function cX(x, radius, angle) {
    return x + radius * Math.cos(radians(angle));	}
function cY(y, radius, angle) {
    return y + radius * Math.sin(radians(angle));	}
function radians(degrees) {
    return degrees*Math.PI/180;		}