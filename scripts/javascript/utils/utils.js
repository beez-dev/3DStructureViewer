
class Measures{

    static px(value){
        return `${value}px`;
    }

    static percent(value){
        return `${value}%`;
    }

    static em(value){
        return `${value}em`;
    }
   
}


class MathUtils{

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let random_value = Math.floor(Math.random() * (max - min + 1)) + min;
        return random_value;

    }

    /**
     * check if value1 is in [value2, value3]
     *  */
    static among(value1 , value2, value3){
        // checkif value1 is in [value2, value3]
        if(value2 > value3){
            [value2, value3] = [value3, value2];
        }
        if( (value1 >= value2) && (value1 <= value3) ){
            return true;
        }
        return false;
    }

    static minMaxClamp(minValue, maxValue, value){
        return Math.max(Math.min( minValue,  value), maxValue);
    }
    
}


class Convert{
    /*converts fps value to the intervals required to complete the frame per second*/
    static fpsIntervals(fpsValue, timeInterval){
        return timeInterval/fpsValue;
    }
}

class StringUtils{
    /*
    * returns true if string1 begins exactly with string2
    * e.g. 'lexical'.beginsWith('lexi') is true
    *  but 'lexical'.beginsExact('lexi') is false with ' ' as separator
    *      'lexi cal'.beginsExact('lexi') would result true
    *
    * */
    static beginsExact(string1, string2, separator = ' '){
        if (string1.length < string2.length) {
            return false;
        }
        let i = 0;
        for (i = 0; i < string2.length; i++) {
            if (string1[i] !== string2[i]) {
                if (string1[i] === separator) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        if (string1[i] === separator) {
            return true;
        }

        return false;
    }
}


class CssHelper{
    static assignProp(domElement,bulkProperty){
        Object.keys(bulkProperty).forEach(
            function(property){
                domElement[property] = bulkProperty[property];
            }
        );
    }

    static assignStyleProp(domElement, bulkProperty){
        CssHelper.assignProp(domElement.style, bulkProperty);
    }

    static  assignStylePropBulk(domElements, bulkProperty){
        domElements.forEach(
            function(eachDomElement){
                CssHelper.assignStyleProp(eachDomElement, bulkProperty);
            }
        );
    }

}


class ObjectUtils{

    static propertyAppend(objectliteral, propertyObjectLiteral){
        for(let property in propertyObjectLiteral){
            objectliteral[property] = propertyObjectLiteral[property];
        }
    }

    static objectPrint(object){
        console.log("*********** printing : "+object+"************************");
        for(let prop in object){
            console.log(`key: ${prop} , value: ${object[prop]}`);
        }
    }
}


export {Measures, MathUtils, StringUtils,
    CssHelper,ObjectUtils, Convert};