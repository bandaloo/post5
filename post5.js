// @ts-nocheck
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blurandtrace = exports.BlurAndTrace = void 0;
const merge_pass_1 = require("@bandaloo/merge-pass");
class BlurAndTrace extends merge_pass_1.EffectLoop {
    constructor(brightness, blurSize, reps, taps, samplerNum, useDepth) {
        const brightnessFloat = merge_pass_1.float(brightness);
        const blurSizeFloat = merge_pass_1.float(blurSize);
        super([
            ...(!useDepth ? [merge_pass_1.loop([merge_pass_1.channel(samplerNum)]).target(samplerNum)] : []),
            merge_pass_1.blur2d(blurSizeFloat, blurSizeFloat, reps, taps),
            merge_pass_1.edge(brightnessFloat, samplerNum),
        ], { num: 1 });
        this.brightnessFloat = brightnessFloat;
        this.blurSizeFloat = blurSizeFloat;
        this.brightness = brightness;
        this.blurSize = blurSize;
    }
    setBrightness(brightness) {
        this.brightnessFloat.setVal(merge_pass_1.wrapInValue(brightness));
        this.brightness = merge_pass_1.wrapInValue(brightness);
    }
    setBlurSize(blurSize) {
        this.blurSizeFloat.setVal(merge_pass_1.wrapInValue(blurSize));
        this.blurSize = merge_pass_1.wrapInValue(blurSize);
    }
}
exports.BlurAndTrace = BlurAndTrace;
function blurandtrace(brightness = merge_pass_1.mut(1), blurSize = merge_pass_1.mut(1), reps = 4, taps = 9, samplerNum = 0, useDepth = false) {
    return new BlurAndTrace(merge_pass_1.wrapInValue(brightness), merge_pass_1.wrapInValue(blurSize), reps, taps, samplerNum, useDepth);
}
exports.blurandtrace = blurandtrace;

},{"@bandaloo/merge-pass":61}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foggyrays = exports.FoggyRaysExpr = void 0;
const merge_pass_1 = require("@bandaloo/merge-pass");
class FoggyRaysExpr extends merge_pass_1.WrappedExpr {
    constructor(period, speed, throwDistance, numSamples, samplerNum, convertDepthColor) {
        const periodFloat = merge_pass_1.float(period);
        const speedFloat = merge_pass_1.float(speed);
        const throwDistanceFloat = merge_pass_1.float(throwDistance);
        const fog = merge_pass_1.op(merge_pass_1.op(merge_pass_1.simplex(merge_pass_1.op(merge_pass_1.op(merge_pass_1.pos(), "+", merge_pass_1.op(merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), "/", periodFloat)), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.op(periodFloat, "*", 2)))), "*", merge_pass_1.simplex(merge_pass_1.op(merge_pass_1.op(merge_pass_1.pos(), "+", merge_pass_1.op(merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), "/", merge_pass_1.op(periodFloat, "*", -2))), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.op(periodFloat, "*", 4))))), "*", 0.5);
        const expr = merge_pass_1.godrays({
            weight: 0.009,
            density: merge_pass_1.op(throwDistanceFloat, "+", merge_pass_1.op(fog, "*", 0.5)),
            convertDepth: convertDepthColor !== undefined
                ? { threshold: 0.01, newColor: convertDepthColor }
                : undefined,
            samplerNum: samplerNum,
            numSamples: numSamples,
        });
        super(expr);
        this.periodFloat = periodFloat;
        this.speedFloat = speedFloat;
        this.throwDistanceFloat = throwDistanceFloat;
        this.godraysExpr = expr;
        this.convertsDepth = convertDepthColor !== undefined;
        this.period = period;
        this.speed = speed;
        this.throwDistance = throwDistance;
    }
    setPeriod(period) {
        this.periodFloat.setVal(merge_pass_1.wrapInValue(period));
        this.period = merge_pass_1.wrapInValue(period);
    }
    setSpeed(speed) {
        this.speedFloat.setVal(merge_pass_1.wrapInValue(speed));
        this.speed = merge_pass_1.wrapInValue(speed);
    }
    setThrowDistance(throwDistance) {
        this.throwDistanceFloat.setVal(merge_pass_1.wrapInValue(throwDistance));
        this.throwDistance = merge_pass_1.wrapInValue(throwDistance);
    }
    setNewColor(newColor) {
        if (this.convertsDepth === undefined) {
            throw new Error("can only set new color if you are converting from a depth buffer");
        }
        this.godraysExpr.setNewColor(newColor);
    }
}
exports.FoggyRaysExpr = FoggyRaysExpr;
function foggyrays(period = merge_pass_1.mut(100), speed = merge_pass_1.mut(1), throwDistance = merge_pass_1.mut(0.3), numSamples = 100, samplerNum, convertDepthColor) {
    return new FoggyRaysExpr(merge_pass_1.wrapInValue(period), merge_pass_1.wrapInValue(speed), merge_pass_1.wrapInValue(throwDistance), numSamples, samplerNum, convertDepthColor);
}
exports.foggyrays = foggyrays;

},{"@bandaloo/merge-pass":61}],3:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./foggyrays"), exports);
__exportStar(require("./vignette"), exports);
__exportStar(require("./blurandtrace"), exports);
__exportStar(require("./lightbands"), exports);
__exportStar(require("./noisedisplacement"), exports);
__exportStar(require("./oldfilm"), exports);
__exportStar(require("./kaleidoscope"), exports);

},{"./blurandtrace":1,"./foggyrays":2,"./kaleidoscope":4,"./lightbands":5,"./noisedisplacement":6,"./oldfilm":7,"./vignette":9}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kaleidoscope = exports.Kaleidoscope = void 0;
const merge_pass_1 = require("@bandaloo/merge-pass");
class Kaleidoscope extends merge_pass_1.WrappedExpr {
    constructor(sides, scale) {
        const sidesFloat = merge_pass_1.float(sides);
        const scaleFloat = merge_pass_1.float(scale);
        const tpos = merge_pass_1.op(merge_pass_1.translate(merge_pass_1.pos(), merge_pass_1.vec2(-0.5, -0.5)), "/", scaleFloat);
        const angle = merge_pass_1.a2("atan", merge_pass_1.getcomp(tpos, "y"), merge_pass_1.getcomp(tpos, "x"));
        const b = merge_pass_1.op(2 * Math.PI, "*", merge_pass_1.op(1, "/", sidesFloat));
        const mangle = merge_pass_1.op(merge_pass_1.a1("floor", merge_pass_1.op(angle, "/", b)), "*", b);
        const a = merge_pass_1.op(angle, "-", mangle);
        const flip = merge_pass_1.op(b, "-", merge_pass_1.op(2, "*", a));
        console.log("test!");
        const sign = merge_pass_1.a1("floor", merge_pass_1.op(merge_pass_1.a2("mod", merge_pass_1.op(mangle, "+", 0.1), merge_pass_1.op(b, "*", 2)), "/", b));
        const spos = merge_pass_1.translate(merge_pass_1.rotate(tpos, merge_pass_1.op(mangle, "-", merge_pass_1.op(flip, "*", sign))), merge_pass_1.vec2(0.5, 0.5));
        super(merge_pass_1.channel(-1, spos));
        this.sidesFloat = sidesFloat;
        this.scaleFloat = scaleFloat;
        this.sides = sides;
        this.scale = scale;
    }
    setSides(sides) {
        this.sidesFloat.setVal(merge_pass_1.wrapInValue(sides));
        this.sides = merge_pass_1.wrapInValue(sides);
    }
    setScale(scale) {
        this.scaleFloat.setVal(merge_pass_1.wrapInValue(scale));
        this.scale = merge_pass_1.wrapInValue(scale);
    }
}
exports.Kaleidoscope = Kaleidoscope;
function kaleidoscope(sides = merge_pass_1.mut(8), scale = merge_pass_1.mut(1)) {
    return new Kaleidoscope(merge_pass_1.wrapInValue(sides), merge_pass_1.wrapInValue(scale));
}
exports.kaleidoscope = kaleidoscope;

},{"@bandaloo/merge-pass":61}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lightbands = exports.LightBands = void 0;
const merge_pass_1 = require("@bandaloo/merge-pass");
class LightBands extends merge_pass_1.WrappedExpr {
    constructor(speed, intensity, threshold, samplerNum) {
        const speedFloat = merge_pass_1.float(speed);
        const intensityFloat = merge_pass_1.float(intensity);
        const thresholdFloat = merge_pass_1.float(threshold);
        const expr = merge_pass_1.brightness(merge_pass_1.ternary(merge_pass_1.op(merge_pass_1.getcomp(merge_pass_1.channel(0), "r"), "-", thresholdFloat), merge_pass_1.op(merge_pass_1.a1("sin", merge_pass_1.op(merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), "+", merge_pass_1.truedepth(merge_pass_1.getcomp(merge_pass_1.channel(samplerNum), "r")))), "*", intensityFloat), 0));
        super(expr);
        this.speedFloat = speedFloat;
        this.intensityFloat = intensityFloat;
        this.thresholdFloat = thresholdFloat;
        this.speed = speed;
        this.intensity = intensity;
        this.threshold = threshold;
    }
    setSpeed(speed) {
        this.speedFloat.setVal(merge_pass_1.wrapInValue(speed));
        this.speed = merge_pass_1.wrapInValue(speed);
    }
    setIntensity(intensity) {
        this.intensityFloat.setVal(merge_pass_1.wrapInValue(intensity));
        this.intensity = merge_pass_1.wrapInValue(intensity);
    }
    setThreshold(threshold) {
        this.thresholdFloat.setVal(merge_pass_1.wrapInValue(threshold));
        this.threshold = merge_pass_1.wrapInValue(threshold);
    }
}
exports.LightBands = LightBands;
function lightbands(speed = merge_pass_1.mut(4), intensity = merge_pass_1.mut(0.3), threshold = merge_pass_1.mut(0.01), samplerNum = 0) {
    return new LightBands(merge_pass_1.wrapInValue(speed), merge_pass_1.wrapInValue(intensity), merge_pass_1.wrapInValue(threshold), samplerNum);
}
exports.lightbands = lightbands;

},{"@bandaloo/merge-pass":61}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noisedisplacement = exports.NoiseDisplacement = void 0;
const merge_pass_1 = require("@bandaloo/merge-pass");
const X_OFF = 1234;
const Y_OFF = 5678;
class NoiseDisplacement extends merge_pass_1.WrappedExpr {
    constructor(period, speed, intensity) {
        const periodFloat = merge_pass_1.float(period);
        const speedFloat = merge_pass_1.float(speed);
        const intensityFloat = merge_pass_1.float(intensity);
        const noise = (comp) => merge_pass_1.simplex(merge_pass_1.op(merge_pass_1.op(merge_pass_1.changecomp(merge_pass_1.op(merge_pass_1.pos(), "/", periodFloat), merge_pass_1.op(merge_pass_1.time(), "*", speedFloat), comp, "+"), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.getcomp(merge_pass_1.resolution(), "y"))), "+", comp === "x" ? X_OFF : Y_OFF));
        super(merge_pass_1.channel(-1, merge_pass_1.op(merge_pass_1.op(merge_pass_1.op(merge_pass_1.vec2(noise("x"), noise("y")), "*", intensityFloat), "*", merge_pass_1.op(merge_pass_1.get2comp(merge_pass_1.resolution(), "yx"), "/", merge_pass_1.getcomp(merge_pass_1.resolution(), "y"))), "+", merge_pass_1.pos())));
        this.periodFloat = periodFloat;
        this.speedFloat = speedFloat;
        this.intensityFloat = intensityFloat;
        this.period = period;
        this.speed = speed;
        this.intensity = intensity;
    }
    setPeriod(period) {
        this.periodFloat.setVal(merge_pass_1.wrapInValue(period));
        this.period = merge_pass_1.wrapInValue(period);
    }
    setSpeed(speed) {
        this.speedFloat.setVal(merge_pass_1.wrapInValue(speed));
        this.speed = merge_pass_1.wrapInValue(speed);
    }
    setIntensity(intensity) {
        this.intensityFloat.setVal(merge_pass_1.wrapInValue(intensity));
        this.speed = merge_pass_1.wrapInValue(intensity);
    }
}
exports.NoiseDisplacement = NoiseDisplacement;
function noisedisplacement(period = merge_pass_1.mut(0.1), speed = merge_pass_1.mut(1), intensity = merge_pass_1.mut(0.005)) {
    return new NoiseDisplacement(period, speed, intensity);
}
exports.noisedisplacement = noisedisplacement;

},{"@bandaloo/merge-pass":61}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oldfilm = exports.OldFilm = void 0;
const merge_pass_1 = require("@bandaloo/merge-pass");
class OldFilm extends merge_pass_1.WrappedExpr {
    constructor(speckIntensity, lineIntensity, grainIntensity) {
        const speckIntensityFloat = merge_pass_1.float(speckIntensity);
        const lineIntensityFloat = merge_pass_1.float(lineIntensity);
        const grainIntensityFloat = merge_pass_1.float(grainIntensity);
        const period = 1 / 3;
        const ftime = merge_pass_1.a1("floor", merge_pass_1.op(merge_pass_1.time(), "*", 24));
        const grainy = merge_pass_1.op(merge_pass_1.random(merge_pass_1.op(merge_pass_1.pixel(), "+", merge_pass_1.a2("mod", merge_pass_1.op(ftime, "*", 99), 3000))), "*", grainIntensityFloat);
        const rpos = merge_pass_1.a2("mod", merge_pass_1.op(merge_pass_1.pos(), "+", merge_pass_1.random(merge_pass_1.vec2(ftime, 0))), merge_pass_1.vec2(100, 100));
        //abs(2.*fract(rate * uv.x + 0.5)-1.);
        const rate = 10;
        /*
        const triangles = op(
          a1(
            "abs",
            op(
              2,
              "*",
              a1(
                "fract",
                op(op(op(rate, "*", getcomp(pos(), "x")), "+", 0.5), "-", 1)
              )
            )
          ),
          "*",
          lineIntensityFloat
        );
        */
        const triangles = merge_pass_1.op(merge_pass_1.op(merge_pass_1.op(merge_pass_1.a1("abs", merge_pass_1.op(merge_pass_1.op(2, "*", merge_pass_1.a1("fract", merge_pass_1.op(rate, "*", merge_pass_1.getcomp(merge_pass_1.pos(), "x")))), "-", 1)), "-", 0.5), "*", 2), "*", lineIntensityFloat);
        //step(1. - 1. / rate, mod(uv.x, 1.));
        const stepping = merge_pass_1.a2("step", merge_pass_1.op(1, "-", merge_pass_1.op(1, "/", rate * 12)), merge_pass_1.a2("mod", merge_pass_1.op(merge_pass_1.getcomp(merge_pass_1.pos(), "x"), "+", merge_pass_1.random(merge_pass_1.op(merge_pass_1.vec2(50, 50), "*", merge_pass_1.time()))), 1));
        const lines = merge_pass_1.op(triangles, "*", stepping);
        const spos = merge_pass_1.a2("mod", merge_pass_1.op(merge_pass_1.op(merge_pass_1.pos(), "*", merge_pass_1.op(merge_pass_1.resolution(), "/", merge_pass_1.getcomp(merge_pass_1.resolution(), "y"))), "+", ftime), merge_pass_1.vec2(100, 100));
        const fsimplex = merge_pass_1.op(merge_pass_1.op(merge_pass_1.simplex(merge_pass_1.op(spos, "*", 7)), "*", 0.44), "+", 0.5);
        const spots = merge_pass_1.op(merge_pass_1.a2("step", fsimplex, 0.08), "*", speckIntensityFloat);
        super(merge_pass_1.monochrome(merge_pass_1.brightness(spots, merge_pass_1.brightness(lines, merge_pass_1.brightness(grainy)))));
        this.speckIntensityFloat = speckIntensityFloat;
        this.lineIntensityFloat = lineIntensityFloat;
        this.grainIntensityFloat = grainIntensityFloat;
        this.speckIntensity = speckIntensity;
        this.lineIntensity = lineIntensity;
        this.grainIntensity = grainIntensity;
    }
    setSpeckIntensity(speckIntensity) {
        this.speckIntensityFloat.setVal(merge_pass_1.wrapInValue(speckIntensity));
        this.speckIntensity = merge_pass_1.wrapInValue(speckIntensity);
    }
    setLineIntensity(lineIntensity) {
        this.lineIntensityFloat.setVal(merge_pass_1.wrapInValue(lineIntensity));
        this.lineIntensity = merge_pass_1.wrapInValue(lineIntensity);
    }
    setGrainIntensity(grainIntensity) {
        this.grainIntensityFloat.setVal(merge_pass_1.wrapInValue(grainIntensity));
        this.grainIntensity = merge_pass_1.wrapInValue(grainIntensity);
    }
}
exports.OldFilm = OldFilm;
function oldfilm(speckIntensity = merge_pass_1.mut(0.4), lineIntensity = merge_pass_1.mut(0.12), grainIntensity = merge_pass_1.mut(0.11)) {
    return new OldFilm(merge_pass_1.wrapInValue(speckIntensity), merge_pass_1.wrapInValue(lineIntensity), merge_pass_1.wrapInValue(grainIntensity));
}
exports.oldfilm = oldfilm;

},{"@bandaloo/merge-pass":61}],8:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const postpre = __importStar(require("./index"));
const mergepass = __importStar(require("@bandaloo/merge-pass"));
window.MP = Object.assign({}, postpre, mergepass);

},{"./index":3,"@bandaloo/merge-pass":61}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vignette = exports.Vignette = void 0;
const merge_pass_1 = require("@bandaloo/merge-pass");
class Vignette extends merge_pass_1.EffectLoop {
    constructor(blurScalar, brightnessScalar, brightnessExponent) {
        const blurScalarFloat = merge_pass_1.float(blurScalar);
        const brightnessScalarFloat = merge_pass_1.float(brightnessScalar);
        const brightnessExponentFloat = merge_pass_1.float(brightnessExponent);
        const blurLen = merge_pass_1.op(merge_pass_1.len(merge_pass_1.center()), "*", blurScalarFloat);
        const blurExpr = merge_pass_1.blur2d(blurLen, blurLen);
        const brightLen = merge_pass_1.a2("pow", merge_pass_1.len(merge_pass_1.center()), brightnessExponentFloat);
        const brightExpr = merge_pass_1.brightness(merge_pass_1.op(brightLen, "*", merge_pass_1.op(brightnessScalarFloat, "*", -1)));
        super([blurExpr, brightExpr], { num: 1 });
        this.blurScalarFloat = blurScalarFloat;
        this.brightnessScalarFloat = brightnessScalarFloat;
        this.brightnessExponentFloat = brightnessExponentFloat;
        this.blurScalar = blurScalar;
        this.brightnessScalar = brightnessScalar;
        this.brightnessExponent = brightnessExponent;
    }
    setBlurScalar(blurScalar) {
        this.blurScalarFloat.setVal(merge_pass_1.wrapInValue(blurScalar));
        this.blurScalar = merge_pass_1.wrapInValue(blurScalar);
    }
    setBrightnessScalar(brightnessScalar) {
        this.brightnessScalarFloat.setVal(merge_pass_1.wrapInValue(brightnessScalar));
        this.brightnessScalar = merge_pass_1.wrapInValue(brightnessScalar);
    }
    setBrightnessExponent(brightnessExponent) {
        this.brightnessExponentFloat.setVal(merge_pass_1.wrapInValue(brightnessExponent));
        this.brightnessExponent = merge_pass_1.wrapInValue(brightnessExponent);
    }
}
exports.Vignette = Vignette;
function vignette(blurScalar = merge_pass_1.mut(3), brightnessScalar = merge_pass_1.mut(1.8), brightnessExponent = merge_pass_1.mut(1.8)) {
    return new Vignette(merge_pass_1.wrapInValue(blurScalar), merge_pass_1.wrapInValue(brightnessScalar), merge_pass_1.wrapInValue(brightnessExponent));
}
exports.vignette = vignette;

},{"@bandaloo/merge-pass":61}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBuilder = exports.channelSamplerName = void 0;
const expr_1 = require("./exprs/expr");
const webglprogramloop_1 = require("./webglprogramloop");
const settings_1 = require("./settings");
/** @ignore */
const FRAG_SET = `  gl_FragColor = texture2D(uSampler, gl_FragCoord.xy / uResolution);\n`;
/** @ignore */
const SCENE_SET = `uniform sampler2D uSceneSampler;\n`;
/** @ignore */
const TIME_SET = `uniform mediump float uTime;\n`;
/** @ignore */
const MOUSE_SET = `uniform mediump vec2 uMouse;\n`;
/** @ignore */
const COUNT_SET = `uniform int uCount;\n`;
/** @ignore */
const BOILERPLATE = `#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform mediump vec2 uResolution;\n`;
/**
 * returns the string name of the sampler uniform for code generation purposes
 * @param num channel number to sample from
 */
function channelSamplerName(num) {
    // texture 2 sampler has number 0 (0 and 1 are used for back buffer and scene)
    return num === -1 ? "uSampler" : `uBufferSampler${num}`;
}
exports.channelSamplerName = channelSamplerName;
/**
 * returns the string of the declaration of the sampler for code generation
 * purposes
 * @param num channel number to sample from
 */
function channelSamplerDeclaration(num) {
    return `uniform sampler2D ${channelSamplerName(num)};`;
}
/** class that manages generation and compilation of GLSL code */
class CodeBuilder {
    constructor(effectLoop) {
        this.calls = [];
        this.externalFuncs = new Set();
        this.uniformDeclarations = new Set();
        this.counter = 0;
        this.baseLoop = effectLoop;
        const buildInfo = {
            uniformTypes: {},
            externalFuncs: new Set(),
            exprs: [],
            // update me on change to needs
            needs: {
                centerSample: false,
                neighborSample: false,
                sceneBuffer: false,
                timeUniform: false,
                mouseUniform: false,
                passCount: false,
                extraBuffers: new Set(),
            },
        };
        this.addEffectLoop(effectLoop, 1, buildInfo);
        // add all the types to uniform declarations from the `BuildInfo` instance
        for (const name in buildInfo.uniformTypes) {
            const typeName = buildInfo.uniformTypes[name];
            this.uniformDeclarations.add(`uniform mediump ${typeName} ${name};`);
        }
        // add all external functions from the `BuildInfo` instance
        buildInfo.externalFuncs.forEach((func) => this.externalFuncs.add(func));
        this.totalNeeds = buildInfo.needs;
        this.exprs = buildInfo.exprs;
    }
    addEffectLoop(effectLoop, indentLevel, buildInfo, topLevel = true) {
        const needsLoop = !topLevel && effectLoop.loopInfo.num > 1;
        if (needsLoop) {
            const iName = "i" + this.counter;
            indentLevel++;
            const forStart = "  ".repeat(indentLevel - 1) +
                `for (int ${iName} = 0; ${iName} < ${effectLoop.loopInfo.num}; ${iName}++) {`;
            this.calls.push(forStart);
        }
        for (const e of effectLoop.effects) {
            if (e instanceof expr_1.Expr) {
                e.parse(buildInfo);
                this.calls.push("  ".repeat(indentLevel) + "gl_FragColor = " + e.sourceCode + ";");
                this.counter++;
            }
            else {
                this.addEffectLoop(e, indentLevel, buildInfo, false);
            }
        }
        if (needsLoop) {
            this.calls.push("  ".repeat(indentLevel - 1) + "}");
        }
    }
    /** generate the code and compile the program into a loop */
    compileProgram(gl, vShader, uniformLocs, shaders = []) {
        // set up the fragment shader
        const fShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (fShader === null) {
            throw new Error("problem creating fragment shader");
        }
        const fullCode = BOILERPLATE +
            (this.totalNeeds.sceneBuffer ? SCENE_SET : "") +
            (this.totalNeeds.timeUniform ? TIME_SET : "") +
            (this.totalNeeds.mouseUniform ? MOUSE_SET : "") +
            (this.totalNeeds.passCount ? COUNT_SET : "") +
            Array.from(this.totalNeeds.extraBuffers)
                .map((n) => channelSamplerDeclaration(n))
                .join("\n") +
            "\n" +
            [...this.uniformDeclarations].join("\n") +
            "\n" +
            [...this.externalFuncs].join("\n") +
            "\n" +
            "void main() {\n" +
            (this.totalNeeds.centerSample ? FRAG_SET : "") +
            this.calls.join("\n") +
            "\n}";
        if (settings_1.settings.verbosity > 0)
            console.log(fullCode);
        gl.shaderSource(fShader, fullCode);
        gl.compileShader(fShader);
        // set up the program
        const program = gl.createProgram();
        if (program === null) {
            throw new Error("problem creating program");
        }
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        shaders.push(fShader);
        const shaderLog = (name, shader) => {
            const output = gl.getShaderInfoLog(shader);
            if (output)
                console.log(`${name} shader info log\n${output}`);
        };
        shaderLog("vertex", vShader);
        shaderLog("fragment", fShader);
        gl.linkProgram(program);
        // we need to use the program here so we can get uniform locations
        gl.useProgram(program);
        // find all uniform locations and add them to the dictionary
        for (const expr of this.exprs) {
            for (const name in expr.uniformValChangeMap) {
                const location = gl.getUniformLocation(program, name);
                if (location === null) {
                    throw new Error("couldn't find uniform " + name);
                }
                // TODO enforce unique names in the same program
                if (uniformLocs[name] === undefined) {
                    uniformLocs[name] = { locs: [], counter: 0 };
                }
                // assign the name to the location
                uniformLocs[name].locs.push(location);
            }
        }
        // set the uniform resolution (every program has this uniform)
        const uResolution = gl.getUniformLocation(program, "uResolution");
        gl.uniform2f(uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
        if (this.totalNeeds.sceneBuffer) {
            // TODO allow for texture options for scene texture
            const location = gl.getUniformLocation(program, "uSceneSampler");
            // put the scene buffer in texture 1 (0 is used for the backbuffer)
            gl.uniform1i(location, 1 + settings_1.settings.offset);
        }
        // set all sampler uniforms
        for (const b of this.totalNeeds.extraBuffers) {
            const location = gl.getUniformLocation(program, channelSamplerName(b));
            // offset the texture location by 2 (0 and 1 are used for scene and original)
            gl.uniform1i(location, b + 2 + settings_1.settings.offset);
        }
        // set the default sampler if there is an offset
        if (settings_1.settings.offset !== 0) {
            const location = gl.getUniformLocation(program, "uSampler");
            gl.uniform1i(location, settings_1.settings.offset);
        }
        // TODO do we need to do this every time?
        // get attribute
        const position = gl.getAttribLocation(program, "aPosition");
        // enable the attribute
        gl.enableVertexAttribArray(position);
        // points to the vertices in the last bound array buffer
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        return new webglprogramloop_1.WebGLProgramLoop(new webglprogramloop_1.WebGLProgramLeaf(program, this.totalNeeds, this.exprs), this.baseLoop.loopInfo, gl);
    }
}
exports.CodeBuilder = CodeBuilder;

},{"./exprs/expr":24,"./settings":63,"./webglprogramloop":65}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.a1 = exports.Arity1HomogenousExpr = void 0;
const expr_1 = require("./expr");
/** @ignore */
function genArity1SourceList(name, val) {
    return {
        sections: [name + "(", ")"],
        values: [val],
    };
}
/** arity 1 homogenous function expression */
class Arity1HomogenousExpr extends expr_1.Operator {
    constructor(val, operation) {
        super(val, genArity1SourceList(operation, val), ["uVal"]);
        this.val = val;
    }
    /** set the value being passed into the arity 1 homogenous function */
    setVal(val) {
        this.setUniform("uVal" + this.id, val);
        this.val = expr_1.wrapInValue(val);
    }
}
exports.Arity1HomogenousExpr = Arity1HomogenousExpr;
/**
 * built-in functions that take in one `genType x` and return a `genType x`
 * @param name function name (see [[Arity1HomogenousName]] for valid function names)
 * @param val the `genType x` argument
 */
function a1(name, val) {
    return new Arity1HomogenousExpr(expr_1.wrapInValue(val), name);
}
exports.a1 = a1;

},{"./expr":24}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.a2 = exports.Arity2HomogenousExpr = void 0;
const expr_1 = require("./expr");
// note: glsl has atan(y/x) as well as atan(y, x)
/** @ignore */
function genArity1SourceList(name, val1, val2) {
    return {
        sections: [name + "(", ",", ")"],
        values: [val1, val2],
    };
}
/** arity 2 homogenous function expression */
class Arity2HomogenousExpr extends expr_1.Operator {
    constructor(name, val1, val2) {
        super(val1, genArity1SourceList(name, val1, val2), ["uVal1", "uVal2"]);
        this.val1 = val1;
        this.val2 = val2;
    }
    /** set the first value being passed into the arity 2 homogenous function */
    setFirstVal(val1) {
        this.setUniform("uVal1" + this.id, val1);
        this.val1 = expr_1.wrapInValue(val1);
    }
    /** set the second value being passed into the arity 2 homogenous function */
    setSecondVal(val2) {
        this.setUniform("uVal2" + this.id, val2);
        this.val2 = expr_1.wrapInValue(val2);
    }
}
exports.Arity2HomogenousExpr = Arity2HomogenousExpr;
// implementation
/**
 * built-in functions that take in two `genType x` arguments and return a `genType x`
 * @param name function name (see [[Arity2HomogenousName]] for valid function names)
 * @param val1 the first `genType x` argument
 * @param val2 the second `genType x` argument
 */
function a2(name, val1, val2) {
    return new Arity2HomogenousExpr(name, expr_1.wrapInValue(val1), expr_1.wrapInValue(val2));
}
exports.a2 = a2;

},{"./expr":24}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloom = exports.BloomLoop = void 0;
const mergepass_1 = require("../mergepass");
const arity2_1 = require("./arity2");
const blurexpr_1 = require("./blurexpr");
const brightnessexpr_1 = require("./brightnessexpr");
const channelsampleexpr_1 = require("./channelsampleexpr");
const contrastexpr_1 = require("./contrastexpr");
const expr_1 = require("./expr");
const fragcolorexpr_1 = require("./fragcolorexpr");
const opexpr_1 = require("./opexpr");
const vecexprs_1 = require("./vecexprs");
// TODO bloom uses `input` so it has to be the first
// TODO maybe a way to update the scene buffer?
/** bloom loop */
class BloomLoop extends mergepass_1.EffectLoop {
    constructor(threshold = expr_1.float(expr_1.mut(0.4)), horizontal = expr_1.float(expr_1.mut(1)), vertical = expr_1.float(expr_1.mut(1)), boost = expr_1.float(expr_1.mut(1.3)), samplerNum = 1, taps = 9, reps = 3) {
        const bright = expr_1.cfloat(expr_1.tag `((${channelsampleexpr_1.channel(samplerNum)}.r + ${channelsampleexpr_1.channel(samplerNum)}.g + ${channelsampleexpr_1.channel(samplerNum)}.b) / 3.)`);
        const step = arity2_1.a2("step", bright, threshold);
        const col = expr_1.cvec4(expr_1.tag `vec4(${channelsampleexpr_1.channel(samplerNum)}.rgb * (1. - ${step}), 1.)`);
        const list = [
            mergepass_1.loop([col]).target(samplerNum),
            mergepass_1.loop([
                blurexpr_1.gauss(vecexprs_1.vec2(horizontal, 0), taps),
                blurexpr_1.gauss(vecexprs_1.vec2(0, vertical), taps),
                brightnessexpr_1.brightness(0.1),
                contrastexpr_1.contrast(boost),
            ], reps).target(samplerNum),
            opexpr_1.op(fragcolorexpr_1.fcolor(), "+", channelsampleexpr_1.channel(samplerNum)),
        ];
        super(list, { num: 1 });
        this.threshold = threshold;
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.boost = boost;
    }
    /**
     * set the horizontal stretch of the blur effect (no greater than 1 for best
     * effect)
     */
    setHorizontal(num) {
        if (!(this.horizontal instanceof expr_1.BasicFloat))
            throw new Error("horizontal expression not basic float");
        this.horizontal.setVal(num);
    }
    /**
     * set the vertical stretch of the blur effect (no greater than 1 for best
     * effect)
     */
    setVertical(num) {
        if (!(this.vertical instanceof expr_1.BasicFloat))
            throw new Error("vertical expression not basic float");
        this.vertical.setVal(num);
    }
    /** set the treshold */
    setThreshold(num) {
        if (!(this.threshold instanceof expr_1.BasicFloat))
            throw new Error("threshold expression not basic float");
        this.threshold.setVal(num);
    }
    /** set the contrast boost */
    setBoost(num) {
        if (!(this.boost instanceof expr_1.BasicFloat))
            throw new Error("boost expression not basic float");
        this.boost.setVal(num);
    }
}
exports.BloomLoop = BloomLoop;
/**
 * creates a bloom loop
 * @param threshold values below this brightness don't get blurred (0.4 is
 * about reasonable, which is also the default)
 * @param horizontal how much to blur vertically (defaults to 1 pixel)
 * @param vertical how much to blur horizontally (defaults to 1 pixel)
 * @param taps how many taps for the blur (defaults to 9)
 * @param reps how many times to loop the blur (defaults to 3)
 */
function bloom(threshold, horizontal, vertical, boost, samplerNum, taps, reps) {
    return new BloomLoop(expr_1.wrapInValue(threshold), expr_1.wrapInValue(horizontal), expr_1.wrapInValue(vertical), expr_1.wrapInValue(boost), samplerNum, taps, reps);
}
exports.bloom = bloom;

},{"../mergepass":62,"./arity2":12,"./blurexpr":15,"./brightnessexpr":16,"./channelsampleexpr":18,"./contrastexpr":19,"./expr":24,"./fragcolorexpr":25,"./opexpr":42,"./vecexprs":58}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blur2d = exports.Blur2dLoop = void 0;
const mergepass_1 = require("../mergepass");
const blurexpr_1 = require("./blurexpr");
const expr_1 = require("./expr");
const vecexprs_1 = require("./vecexprs");
/** 2D blur loop */
class Blur2dLoop extends mergepass_1.EffectLoop {
    constructor(horizontal = expr_1.float(expr_1.mut(1)), vertical = expr_1.float(expr_1.mut(1)), reps = 2, taps, samplerNum) {
        const side = blurexpr_1.gauss(vecexprs_1.vec2(horizontal, 0), taps, samplerNum);
        const up = blurexpr_1.gauss(vecexprs_1.vec2(0, vertical), taps, samplerNum);
        super([side, up], { num: reps });
        this.horizontal = horizontal;
        this.vertical = vertical;
    }
    /**
     * set the horizontal stretch of the blur effect (no greater than 1 for best
     * effect)
     */
    setHorizontal(num) {
        if (!(this.horizontal instanceof expr_1.BasicFloat))
            throw new Error("horizontal expression not basic float");
        this.horizontal.setVal(num);
    }
    /**
     * set the vertical stretch of the blur effect (no greater than 1 for best
     * effect)
     */
    setVertical(num) {
        if (!(this.vertical instanceof expr_1.BasicFloat))
            throw new Error("vertical expression not basic float");
        this.vertical.setVal(num);
    }
}
exports.Blur2dLoop = Blur2dLoop;
/**
 * creates a loop that runs a horizontal, then vertical gaussian blur (anything
 * more than 1 pixel in the horizontal or vertical direction will create a
 * ghosting effect, which is usually not desirable)
 * @param horizontalExpr float for the horizontal blur (1 pixel default)
 * @param verticalExpr float for the vertical blur (1 pixel default)
 * @param reps how many passes (defaults to 2)
 * @param taps how many taps (defaults to 5)
 * @param samplerNum change if you want to sample from a different channel and
 * the outer loop has a different target
 */
function blur2d(horizontalExpr, verticalExpr, reps, taps, samplerNum) {
    return new Blur2dLoop(expr_1.wrapInValue(horizontalExpr), expr_1.wrapInValue(verticalExpr), reps, taps, samplerNum);
}
exports.blur2d = blur2d;

},{"../mergepass":62,"./blurexpr":15,"./expr":24,"./vecexprs":58}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gauss = exports.BlurExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
/** @ignore */
function genBlurSource(direction, taps) {
    return {
        sections: [`gauss${taps}(`, ")"],
        values: [direction],
    };
}
/** @ignore */
function tapsToFuncSource(taps) {
    switch (taps) {
        case 5:
            return glslfunctions_1.glslFuncs.gauss5;
        case 9:
            return glslfunctions_1.glslFuncs.gauss9;
        case 13:
            return glslfunctions_1.glslFuncs.gauss13;
    }
}
/** gaussian blur expression */
class BlurExpr extends expr_1.ExprVec4 {
    constructor(direction, taps = 5, samplerNum) {
        // this is already guaranteed by typescript, but creates helpful error for
        // use in gibber or anyone just using javascript
        if (![5, 9, 13].includes(taps)) {
            throw new Error("taps for gauss blur can only be 5, 9 or 13");
        }
        super(genBlurSource(direction, taps), ["uDirection"]);
        this.direction = direction;
        this.externalFuncs = [tapsToFuncSource(taps)];
        this.brandExprWithChannel(0, samplerNum);
    }
    /** set the blur direction (keep magnitude no greater than 1 for best effect) */
    setDirection(direction) {
        this.setUniform("uDirection" + this.id, direction);
        this.direction = direction;
    }
}
exports.BlurExpr = BlurExpr;
/**
 * creates expression that performs one pass of a gaussian blur
 * @param direction direction to blur (keep magnitude less than or equal to 1
 * for best effect)
 * @param taps number of taps (defaults to 5)
 * @param samplerNum which channel to sample from (default 0)
 */
function gauss(direction, taps = 5, samplerNum) {
    return new BlurExpr(direction, taps, samplerNum);
}
exports.gauss = gauss;

},{"../glslfunctions":60,"./expr":24}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brightness = exports.Brightness = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
const fragcolorexpr_1 = require("./fragcolorexpr");
/** brightness expression */
class Brightness extends expr_1.ExprVec4 {
    constructor(brightness, col = fragcolorexpr_1.fcolor()) {
        super(expr_1.tag `brightness(${brightness}, ${col})`, ["uBrightness", "uColor"]);
        this.brightness = brightness;
        this.externalFuncs = [glslfunctions_1.glslFuncs.brightness];
    }
    /** set the brightness (should probably be between -1 and 1) */
    setBrightness(brightness) {
        this.setUniform("uBrightness" + this.id, brightness);
        this.brightness = expr_1.wrapInValue(brightness);
    }
}
exports.Brightness = Brightness;
/**
 * changes the brightness of a color
 * @param val float for how much to change the brightness by (should probably be
 * between -1 and 1)
 * @param col the color to increase the brightness of (defaults to current
 * fragment color)
 */
function brightness(val, col) {
    return new Brightness(expr_1.wrapInValue(val), col);
}
exports.brightness = brightness;

},{"../glslfunctions":60,"./expr":24,"./fragcolorexpr":25}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changecomp = exports.ChangeCompExpr = void 0;
const expr_1 = require("./expr");
const getcompexpr_1 = require("./getcompexpr");
/** @ignore */
function getChangeFunc(typ, id, setter, comps, op = "") {
    return `${typ} changecomp_${id}(${typ} col, ${setter.typeString()} setter) {
  col.${comps} ${op}= setter;
  return col;
}`;
}
/**
 * throws a runtime error if component access is not valid, and disallows
 * duplicate components because duplicate components can not be in a left
 * expression. (for example `v.xyx = vec3(1., 2., 3.)` is illegal, but `v1.xyz
 * = v2.xyx` is legal.) also checks for type errors such as `v1.xy = vec3(1.,
 * 2., 3.)`; the right hand side can only be a `vec2` if only two components
 * are supplied
 * @param comps component string
 * @param setter how the components are being changed
 * @param vec the vector where components are being accessed
 */
function checkChangeComponents(comps, setter, vec) {
    // setter has different length than components
    if (comps.length !== getcompexpr_1.typeStringToLength(setter.typeString())) {
        throw new Error("components length must be equal to the target float/vec");
    }
    // duplicate components
    if (duplicateComponents(comps)) {
        throw new Error("duplicate components not allowed on left side");
    }
    // legal components
    getcompexpr_1.checkLegalComponents(comps, vec);
}
/** @ignore */
function duplicateComponents(comps) {
    return new Set(comps.split("")).size !== comps.length;
}
/** change component expression */
class ChangeCompExpr extends expr_1.Operator {
    constructor(vec, setter, comps, op) {
        checkChangeComponents(comps, setter, vec);
        // part of name of custom function
        const operation = op === "+"
            ? "plus"
            : op === "-"
                ? "minus"
                : op === "*"
                    ? "mult"
                    : op === "/"
                        ? "div"
                        : "assign";
        const suffix = `${vec.typeString()}_${setter.typeString()}_${comps}_${operation}`;
        super(vec, { sections: [`changecomp_${suffix}(`, ", ", ")"], values: [vec, setter] }, ["uOriginal", "uNew"]);
        this.originalVec = vec;
        this.newVal = setter;
        this.externalFuncs = [
            getChangeFunc(vec.typeString(), suffix, setter, comps, op),
        ];
    }
    /** set the original vector */
    setOriginal(originalVec) {
        this.setUniform("uOriginal" + this.id, originalVec);
        this.originalVec = originalVec;
    }
    /** set the neww vector */
    setNew(newVal) {
        this.setUniform("uNew" + this.id, newVal);
        this.newVal = expr_1.wrapInValue(newVal);
    }
}
exports.ChangeCompExpr = ChangeCompExpr;
/**
 * change the components of a vector
 * @param vec the vector to augment components of
 * @param setter the vector (or float, if only one component is changed) for
 * how to change the components
 * @param comps string representing the components to change (e.g. `"xy"` or
 * `"r"` or `"stpq"`.)
 * @param op optionally perform an operation on the original component
 * (defaults to no operation, just assigning that component to a new value)
 */
function changecomp(vec, setter, comps, op) {
    return new ChangeCompExpr(vec, expr_1.wrapInValue(setter), comps, op);
}
exports.changecomp = changecomp;

},{"./expr":24,"./getcompexpr":29}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = exports.ChannelSampleExpr = void 0;
const codebuilder_1 = require("../codebuilder");
const expr_1 = require("./expr");
const normfragcoordexpr_1 = require("./normfragcoordexpr");
const glslfunctions_1 = require("../glslfunctions");
/** @ignore */
function genChannelSampleSource(buf, coord) {
    return {
        sections: ["channel(", `, ${codebuilder_1.channelSamplerName(buf)})`],
        values: [coord],
    };
}
// TODO create a way to sample but not clamp by region
/** channel sample expression */
class ChannelSampleExpr extends expr_1.ExprVec4 {
    constructor(buf, coord = normfragcoordexpr_1.pos()) {
        super(genChannelSampleSource(buf, coord), ["uVec"]);
        this.coord = coord;
        this.externalFuncs = [glslfunctions_1.glslFuncs.channel];
        if (buf !== -1)
            this.needs.extraBuffers = new Set([buf]);
    }
    setCoord(coord) {
        this.setUniform("uVec", coord);
        this.coord = coord;
    }
}
exports.ChannelSampleExpr = ChannelSampleExpr;
/**
 * creates an expression that samples from one of the user-defined channels.
 * don't sample from the same channel that you are using [[target]] on in a
 * loop, just use [[fcolor]]
 * @param channel which channel to sample from
 * @param vec where to sample the channel texture (defaults to the normalized
 * frag coord)
 */
function channel(channel, vec) {
    return new ChannelSampleExpr(channel, vec);
}
exports.channel = channel;

},{"../codebuilder":10,"../glslfunctions":60,"./expr":24,"./normfragcoordexpr":40}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contrast = exports.ContrastExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
const fragcolorexpr_1 = require("./fragcolorexpr");
class ContrastExpr extends expr_1.ExprVec4 {
    constructor(contrast, col = fragcolorexpr_1.fcolor()) {
        super(expr_1.tag `contrast(${contrast}, ${col})`, ["uVal", "uCol"]);
        this.contrast = contrast;
        this.externalFuncs = [glslfunctions_1.glslFuncs.contrast];
    }
    /** sets the contrast */
    setContrast(contrast) {
        this.setUniform("uContrast" + this.id, contrast);
        this.contrast = expr_1.wrapInValue(contrast);
    }
}
exports.ContrastExpr = ContrastExpr;
/**
 * changes the contrast of a color
 * @param val float for how much to change the contrast by (should probably be
 * between -1 and 1)
 * @param col the color to increase the contrast of (defaults to current
 * fragment color)
 */
function contrast(val, col) {
    return new ContrastExpr(expr_1.wrapInValue(val), col);
}
exports.contrast = contrast;

},{"../glslfunctions":60,"./expr":24,"./fragcolorexpr":25}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depth2occlusion = exports.DepthToOcclusionExpr = void 0;
const channelsampleexpr_1 = require("./channelsampleexpr");
const expr_1 = require("./expr");
const vecexprs_1 = require("./vecexprs");
/** depth info to occlussion info expression */
class DepthToOcclusionExpr extends expr_1.ExprVec4 {
    constructor(depthCol = channelsampleexpr_1.channel(0), newCol = expr_1.mut(vecexprs_1.pvec4(1, 1, 1, 1)), threshold = expr_1.mut(expr_1.pfloat(0.01))) {
        super(expr_1.tag `depth2occlusion(${depthCol}, ${newCol}, ${threshold})`, [
            "uDepth",
            "uNewCol",
            "uThreshold",
        ]);
        this.depthCol = depthCol;
        this.newCol = newCol;
        this.threshold = threshold;
    }
    setDepthColor(depthCol) {
        this.setUniform("uDepth" + this.id, depthCol);
        this.depthCol = depthCol;
    }
    setNewColor(newCol) {
        this.setUniform("uNewCol" + this.id, newCol);
        this.newCol = newCol;
    }
    setThreshold(threshold) {
        this.setUniform("uThreshold" + this.id, threshold);
        this.threshold = expr_1.wrapInValue(threshold);
    }
}
exports.DepthToOcclusionExpr = DepthToOcclusionExpr;
/**
 * converts a `1 / distance` depth texture to an occlusion texture, with all
 * occluded geometry being rendered as black
 * @param depthCol the color representing the inverse depth (defaults to
 * sampling from channel 0)
 * @param newCol the color to replace unoccluded areas by (defaults to white
 * and is mutable by default)
 * @param threshold values below this are not occluded (set to something low,
 * like 0.1 or lower; defaults to 0.01 and is mutable by default)
 */
function depth2occlusion(depthCol, newCol, threshold) {
    return new DepthToOcclusionExpr(depthCol, newCol, expr_1.wrapInValue(threshold));
}
exports.depth2occlusion = depth2occlusion;

},{"./channelsampleexpr":18,"./expr":24,"./vecexprs":58}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dof = exports.DoFLoop = void 0;
const mergepass_1 = require("../mergepass");
const arity2_1 = require("./arity2");
const blurexpr_1 = require("./blurexpr");
const channelsampleexpr_1 = require("./channelsampleexpr");
const expr_1 = require("./expr");
const gaussianexpr_1 = require("./gaussianexpr");
const getcompexpr_1 = require("./getcompexpr");
const opexpr_1 = require("./opexpr");
const vecexprs_1 = require("./vecexprs");
class DoFLoop extends mergepass_1.EffectLoop {
    constructor(depth = expr_1.mut(expr_1.pfloat(0.3)), rad = expr_1.mut(expr_1.pfloat(0.01)), depthInfo = getcompexpr_1.getcomp(channelsampleexpr_1.channel(0), "r"), reps = 2, taps = 13) {
        let guassianExpr = gaussianexpr_1.gaussian(depthInfo, depth, rad);
        const side = blurexpr_1.gauss(vecexprs_1.vec2(arity2_1.a2("pow", opexpr_1.op(1, "-", guassianExpr), 4), 0), taps);
        const up = blurexpr_1.gauss(vecexprs_1.vec2(0, arity2_1.a2("pow", opexpr_1.op(1, "-", guassianExpr), 4)), taps);
        super([side, up], { num: reps });
        this.gaussian = guassianExpr;
    }
    setDepth(depth) {
        // this translates the gaussian curve to the side
        this.gaussian.setA(depth);
    }
    setRadius(radius) {
        // this scales the gaussian curve to focus on a larger band of depth
        this.gaussian.setB(radius);
    }
}
exports.DoFLoop = DoFLoop;
/**
 * creates depth of field expression; all values are mutable by default
 * @param depth float for what inverse depth to focus on (1 on top of the
 * camera; 0 is infinity)
 * @param rad float for how deep the band of in-focus geometry is (a value
 * between 0.01 and 0.1 is reasonable)
 * @param depthInfo float the expression that represents the inverse depth
 * (defaults to sampling the red component from channel 0)
 * @param reps how many times to repeat the gaussian blur
 */
function dof(depth, rad, depthInfo, reps) {
    return new DoFLoop(expr_1.wrapInValue(depth), expr_1.wrapInValue(rad), expr_1.wrapInValue(depthInfo), reps);
}
exports.dof = dof;

},{"../mergepass":62,"./arity2":12,"./blurexpr":15,"./channelsampleexpr":18,"./expr":24,"./gaussianexpr":28,"./getcompexpr":29,"./opexpr":42,"./vecexprs":58}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.edgecolor = exports.EdgeColorExpr = void 0;
const arity2_1 = require("./arity2");
const expr_1 = require("./expr");
const fragcolorexpr_1 = require("./fragcolorexpr");
const monochromeexpr_1 = require("./monochromeexpr");
const sobelexpr_1 = require("./sobelexpr");
const vecexprs_1 = require("./vecexprs");
/** edge color expression */
class EdgeColorExpr extends expr_1.WrappedExpr {
    constructor(color, samplerNum, stepped = true) {
        const expr = stepped
            ? expr_1.cvec4(expr_1.tag `mix(${color}, ${fragcolorexpr_1.fcolor()}, ${monochromeexpr_1.monochrome(arity2_1.a2("step", vecexprs_1.vec4(0.5, 0.5, 0.5, 0.0), sobelexpr_1.sobel(samplerNum)))})`)
            : expr_1.cvec4(expr_1.tag `mix(${color}, ${fragcolorexpr_1.fcolor()}, ${monochromeexpr_1.monochrome(sobelexpr_1.sobel(samplerNum))})`);
        super(expr);
        this.color = color;
        this.expr = expr;
    }
    setColor(color) {
        this.expr.setUniform("uCustomName0" + this.expr.id, color);
        this.color = color;
    }
}
exports.EdgeColorExpr = EdgeColorExpr;
/**
 * creates a colored edge detection expression
 * @param color what color to make the edge
 * @param samplerNum where to sample from
 * @param stepped whether to round the result of sobel edge detection (defaults
 * to true)
 */
function edgecolor(color, samplerNum, stepped) {
    return new EdgeColorExpr(color, samplerNum, stepped);
}
exports.edgecolor = edgecolor;

},{"./arity2":12,"./expr":24,"./fragcolorexpr":25,"./monochromeexpr":35,"./sobelexpr":53,"./vecexprs":58}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.edge = exports.EdgeExpr = void 0;
const brightnessexpr_1 = require("./brightnessexpr");
const expr_1 = require("./expr");
const getcompexpr_1 = require("./getcompexpr");
const invertexpr_1 = require("./invertexpr");
const monochromeexpr_1 = require("./monochromeexpr");
const opexpr_1 = require("./opexpr");
const sobelexpr_1 = require("./sobelexpr");
class EdgeExpr extends expr_1.WrappedExpr {
    constructor(mult = expr_1.mut(-1.0), samplerNum) {
        const operator = opexpr_1.op(getcompexpr_1.getcomp(invertexpr_1.invert(monochromeexpr_1.monochrome(sobelexpr_1.sobel(samplerNum))), "r"), "*", mult);
        super(brightnessexpr_1.brightness(operator));
        this.mult = mult;
        this.operator = operator;
    }
    setMult(mult) {
        this.operator.setRight(mult);
        this.mult = expr_1.wrapInValue(mult);
    }
}
exports.EdgeExpr = EdgeExpr;
/**
 * returns an expression highlights edges where they appear
 * @param style `"dark"` for dark edges and `"light"` for light edges, or a
 * custom number or expression (between -1 and 1) for a more gray style of edge
 * @param samplerNum where to sample from
 */
function edge(style, samplerNum) {
    const mult = style === "dark" ? -1 : style === "light" ? 1 : style;
    return new EdgeExpr(expr_1.wrapInValue(mult), samplerNum);
}
exports.edge = edge;

},{"./brightnessexpr":16,"./expr":24,"./getcompexpr":29,"./invertexpr":33,"./monochromeexpr":35,"./opexpr":42,"./sobelexpr":53}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tag = exports.wrapInValue = exports.pfloat = exports.Operator = exports.WrappedExpr = exports.ExprVec4 = exports.ExprVec3 = exports.ExprVec2 = exports.float = exports.ExprFloat = exports.BasicFloat = exports.ExprVec = exports.BasicVec4 = exports.BasicVec3 = exports.BasicVec2 = exports.BasicVec = exports.PrimitiveVec4 = exports.PrimitiveVec3 = exports.PrimitiveVec2 = exports.PrimitiveVec = exports.PrimitiveFloat = exports.Primitive = exports.mut = exports.Mutable = exports.cvec4 = exports.cvec3 = exports.cvec2 = exports.cfloat = exports.Expr = void 0;
const mergepass_1 = require("../mergepass");
const webglprogramloop_1 = require("../webglprogramloop");
const utils_1 = require("../utils");
/**
 * adds a `.` after a number if needed (e.g converts `1` to `"1."` but leaves
 * `1.2` as `"1.2"`)
 * @param num number to convert
 */
function toGLSLFloatString(num) {
    let str = "" + num;
    if (!str.includes("."))
        str += ".";
    return str;
}
class Expr {
    constructor(sourceLists, defaultNames) {
        // update me on change to needs
        this.needs = {
            neighborSample: false,
            centerSample: false,
            sceneBuffer: false,
            timeUniform: false,
            mouseUniform: false,
            passCount: false,
            extraBuffers: new Set(),
        };
        this.uniformValChangeMap = {};
        this.defaultNameMap = {};
        this.externalFuncs = [];
        this.sourceCode = "";
        this.funcIndex = 0;
        this.regionBranded = false;
        this.id = "_id_" + Expr.count;
        Expr.count++;
        if (sourceLists.sections.length - sourceLists.values.length !== 1) {
            // this cannot happen if you use `tag` to destructure a template string
            throw new Error("wrong lengths for source and values");
        }
        if (sourceLists.values.length !== defaultNames.length) {
            console.log(sourceLists);
            console.log(defaultNames);
            throw new Error("default names list length doesn't match values list length");
        }
        this.sourceLists = sourceLists;
        this.defaultNames = defaultNames;
    }
    applyUniforms(gl, uniformLocs) {
        for (const name in this.uniformValChangeMap) {
            const loc = uniformLocs[name];
            if (this.uniformValChangeMap[name].changed) {
                //this.uniformValChangeMap[name].changed = false;
                this.uniformValChangeMap[name].val.applyUniform(gl, loc.locs[loc.counter]);
            }
            // increment and reset the counter to wrap back around to first location
            loc.counter++;
            loc.counter %= loc.locs.length;
            // once we have wrapped then we know all uniforms have been changed
            if (loc.counter === 0) {
                this.uniformValChangeMap[name].changed = false;
            }
        }
    }
    getSampleNum(mult = 1) {
        return this.needs.neighborSample
            ? mult
            : this.sourceLists.values
                .map((v) => v.getSampleNum())
                .reduce((acc, curr) => acc + curr, 0);
    }
    /**
     * set a uniform by name directly
     * @param name uniform name in the source code
     * @param newVal value to set the uniform to
     */
    setUniform(name, newVal) {
        var _a, _b;
        newVal = wrapInValue(newVal);
        const originalName = name;
        if (typeof newVal === "number") {
            newVal = wrapInValue(newVal);
        }
        if (!(newVal instanceof Primitive)) {
            throw new Error("cannot set a non-primitive");
        }
        // if name does not exist, try mapping default name to new name
        if (((_a = this.uniformValChangeMap[name]) === null || _a === void 0 ? void 0 : _a.val) === undefined) {
            name = this.defaultNameMap[name];
        }
        const oldVal = (_b = this.uniformValChangeMap[name]) === null || _b === void 0 ? void 0 : _b.val;
        if (oldVal === undefined) {
            throw new Error("tried to set uniform " +
                name +
                " which doesn't exist. original name: " +
                originalName);
        }
        if (oldVal.typeString() !== newVal.typeString()) {
            throw new Error("tried to set uniform " + name + " to a new type");
        }
        this.uniformValChangeMap[name].val = newVal;
        this.uniformValChangeMap[name].changed = true;
    }
    /**
     * parses this expression into a string, adding info as it recurses into
     * nested expressions
     */
    parse(buildInfo) {
        this.sourceCode = "";
        buildInfo.exprs.push(this);
        buildInfo.needs = webglprogramloop_1.updateNeeds(buildInfo.needs, this.needs);
        // add each of the external funcs to the builder
        this.externalFuncs.forEach((func) => buildInfo.externalFuncs.add(func));
        // put all of the values between all of the source sections
        for (let i = 0; i < this.sourceLists.values.length; i++) {
            this.sourceCode +=
                this.sourceLists.sections[i] +
                    this.sourceLists.values[i].parse(buildInfo, this.defaultNames[i], this);
        }
        // TODO does sourceCode have to be a member?
        this.sourceCode += this.sourceLists.sections[this.sourceLists.sections.length - 1];
        return this.sourceCode;
    }
    addFuncs(funcs) {
        this.externalFuncs.push(...funcs);
        return this;
    }
    brandExprWithChannel(funcIndex, samplerNum) {
        utils_1.brandWithChannel(this.sourceLists, this.externalFuncs, this.needs, funcIndex, samplerNum);
        return this;
    }
    brandExprWithRegion(space) {
        utils_1.brandWithRegion(this, this.funcIndex, space);
        for (const v of this.sourceLists.values) {
            v.brandExprWithRegion(space);
        }
        return this;
    }
}
exports.Expr = Expr;
/**
 * increments for each expression created; used to uniquely id each expression
 */
Expr.count = 0;
function genCustomNames(sourceLists) {
    const names = [];
    for (let i = 0; i < sourceLists.values.length; i++) {
        names.push("uCustomName" + i);
    }
    return names;
}
/** create a custom float function (use with [[tag]]) */
function cfloat(sourceLists, externalFuncs = []) {
    return new ExprFloat(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
}
exports.cfloat = cfloat;
/** create a custom vec2 function (use with [[tag]]) */
function cvec2(sourceLists, externalFuncs = []) {
    return new ExprVec2(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
}
exports.cvec2 = cvec2;
/** create a custom vec3 function (use with [[tag]]) */
function cvec3(sourceLists, externalFuncs = []) {
    return new ExprVec3(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
}
exports.cvec3 = cvec3;
/** create a custom vec4 function (use with [[tag]]) */
function cvec4(sourceLists, externalFuncs = []) {
    return new ExprVec4(sourceLists, genCustomNames(sourceLists)).addFuncs(externalFuncs);
}
exports.cvec4 = cvec4;
class Mutable {
    constructor(primitive, name) {
        this.primitive = primitive;
        this.name = name;
    }
    parse(buildInfo, defaultName, enc) {
        if (enc === undefined) {
            throw new Error("tried to put a mutable expression at the top level");
        }
        // accept the default name if given no name
        if (this.name === undefined)
            this.name = defaultName + enc.id;
        // set to true so they are set to their default values on first draw
        buildInfo.uniformTypes[this.name] = this.primitive.typeString();
        // add the name mapping
        enc.uniformValChangeMap[this.name] = {
            val: this.primitive,
            changed: true,
        };
        // add the new type to the map
        enc.defaultNameMap[defaultName + enc.id] = this.name;
        return this.name;
    }
    applyUniform(gl, loc) {
        this.primitive.applyUniform(gl, loc);
    }
    typeString() {
        return this.primitive.typeString();
    }
    getSampleNum() {
        return 0;
    }
    brandExprWithRegion(space) {
        return this;
    }
}
exports.Mutable = Mutable;
/**
 * makes a primitive value mutable. wrapping a [[PrimitiveVec]] or
 * [[PrimitiveFloat]] in [[mut]] before passing it into an expression will
 * allow you to use the setters on that expression to change those values at
 * runtime
 * @param val the primitive float or primitive vec to make mutable
 * @param name the optional name for the uniform
 */
function mut(val, name) {
    const primitive = typeof val === "number" ? wrapInValue(val) : val;
    return new Mutable(primitive, name);
}
exports.mut = mut;
class Primitive {
    parse() {
        return this.toString();
    }
    getSampleNum() {
        return 0;
    }
    brandExprWithRegion(space) {
        return this;
    }
}
exports.Primitive = Primitive;
class PrimitiveFloat extends Primitive {
    constructor(num) {
        if (!isFinite(num))
            throw new Error("number not finite");
        super();
        this.value = num;
    }
    toString() {
        let str = "" + this.value;
        if (!str.includes("."))
            str += ".";
        return str;
    }
    typeString() {
        return "float";
    }
    applyUniform(gl, loc) {
        gl.uniform1f(loc, this.value);
    }
}
exports.PrimitiveFloat = PrimitiveFloat;
class PrimitiveVec extends Primitive {
    constructor(comps) {
        super();
        this.values = comps;
    }
    typeString() {
        return ("vec" + this.values.length);
    }
    toString() {
        return `${this.typeString()}(${this.values
            .map((n) => toGLSLFloatString(n))
            .join(", ")})`;
    }
}
exports.PrimitiveVec = PrimitiveVec;
class PrimitiveVec2 extends PrimitiveVec {
    applyUniform(gl, loc) {
        gl.uniform2f(loc, this.values[0], this.values[1]);
    }
}
exports.PrimitiveVec2 = PrimitiveVec2;
class PrimitiveVec3 extends PrimitiveVec {
    applyUniform(gl, loc) {
        gl.uniform3f(loc, this.values[0], this.values[1], this.values[2]);
    }
}
exports.PrimitiveVec3 = PrimitiveVec3;
class PrimitiveVec4 extends PrimitiveVec {
    applyUniform(gl, loc) {
        gl.uniform4f(loc, this.values[0], this.values[1], this.values[2], this.values[3]);
    }
}
exports.PrimitiveVec4 = PrimitiveVec4;
class BasicVec extends Expr {
    constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        // this cast is fine as long as you only instantiate these with the
        // shorthand version and not the constructor
        const values = sourceLists.values;
        this.values = values;
        this.defaultNames = defaultNames;
    }
    typeString() {
        return ("vec" + this.values.length);
    }
    /** sets a component of the vector */
    setComp(index, primitive) {
        if (index < 0 || index >= this.values.length) {
            throw new Error("out of bounds of setting component");
        }
        this.setUniform(this.defaultNames[index] + this.id, wrapInValue(primitive));
    }
}
exports.BasicVec = BasicVec;
class BasicVec2 extends BasicVec {
    constructor() {
        super(...arguments);
        this.bvec2 = undefined; // brand for nominal typing
    }
}
exports.BasicVec2 = BasicVec2;
class BasicVec3 extends BasicVec {
    constructor() {
        super(...arguments);
        this.bvec3 = undefined; // brand for nominal typing
    }
}
exports.BasicVec3 = BasicVec3;
class BasicVec4 extends BasicVec {
    constructor() {
        super(...arguments);
        this.bvec4 = undefined; // brand for nominal typing
    }
}
exports.BasicVec4 = BasicVec4;
class ExprVec extends Expr {
    constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        const values = sourceLists.values;
        this.values = values;
        this.defaultNames = defaultNames;
    }
}
exports.ExprVec = ExprVec;
class BasicFloat extends Expr {
    constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        this.float = undefined; // brand for nominal typing
    }
    setVal(primitive) {
        this.setUniform("uFloat" + this.id, wrapInValue(primitive));
    }
    typeString() {
        return "float";
    }
}
exports.BasicFloat = BasicFloat;
class ExprFloat extends Expr {
    constructor(sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        this.float = undefined; // brand for nominal typing
    }
    setVal(primitive) {
        this.setUniform("uFloat" + this.id, wrapInValue(primitive));
    }
    typeString() {
        return "float";
    }
}
exports.ExprFloat = ExprFloat;
function float(value) {
    if (typeof value === "number")
        value = wrapInValue(value);
    return new BasicFloat({ sections: ["", ""], values: [value] }, ["uFloat"]);
}
exports.float = float;
class ExprVec2 extends ExprVec {
    constructor() {
        super(...arguments);
        this.vec2 = undefined; // brand for nominal typing
    }
    typeString() {
        return "vec2";
    }
}
exports.ExprVec2 = ExprVec2;
class ExprVec3 extends ExprVec {
    constructor() {
        super(...arguments);
        this.vec3 = undefined; // brand for nominal typing
    }
    typeString() {
        return "vec3";
    }
}
exports.ExprVec3 = ExprVec3;
class ExprVec4 extends ExprVec {
    constructor() {
        super(...arguments);
        this.vec4 = undefined; // brand for nominal typing
    }
    repeat(num) {
        return new mergepass_1.EffectLoop([this], { num: num });
    }
    genPrograms(gl, vShader, uniformLocs, shaders) {
        return new mergepass_1.EffectLoop([this], { num: 1 }).genPrograms(gl, vShader, uniformLocs, shaders);
    }
    typeString() {
        return "vec4";
    }
}
exports.ExprVec4 = ExprVec4;
class WrappedExpr {
    constructor(expr) {
        this.expr = expr;
    }
    typeString() {
        return this.expr.typeString();
    }
    parse(buildInfo, defaultName, enc) {
        return this.expr.parse(buildInfo, defaultName, enc);
    }
    getSampleNum() {
        return this.expr.getSampleNum();
    }
    brandExprWithRegion(space) {
        return this.expr.brandExprWithRegion(space);
    }
}
exports.WrappedExpr = WrappedExpr;
class Operator extends Expr {
    constructor(ret, sourceLists, defaultNames) {
        super(sourceLists, defaultNames);
        this.ret = ret;
    }
    typeString() {
        return this.ret.typeString();
    }
}
exports.Operator = Operator;
/** creates a primitive float */
function pfloat(num) {
    return new PrimitiveFloat(num);
}
exports.pfloat = pfloat;
function wrapInValue(num) {
    if (num === undefined)
        return undefined;
    if (typeof num === "number")
        return pfloat(num);
    return num;
}
exports.wrapInValue = wrapInValue;
/**
 * takes a template strings array and converts it to a source list; very useful
 * for [[cfloat]], [[cvec2]], [[cvec3]] and [[cvec4]]
 */
function tag(strings, ...values) {
    return { sections: strings.concat([]), values: values };
}
exports.tag = tag;

},{"../mergepass":62,"../utils":64,"../webglprogramloop":65}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcolor = exports.FragColorExpr = void 0;
const expr_1 = require("./expr");
/** fragment color expression */
class FragColorExpr extends expr_1.ExprVec4 {
    constructor() {
        super(expr_1.tag `gl_FragColor`, []);
        this.needs.centerSample = true;
    }
}
exports.FragColorExpr = FragColorExpr;
/** creates an expression that evaluates to the fragment color */
function fcolor() {
    return new FragColorExpr();
}
exports.fcolor = fcolor;

},{"./expr":24}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixel = exports.FragCoordExpr = void 0;
const expr_1 = require("./expr");
/** frag coord expression (xy components only) */
class FragCoordExpr extends expr_1.ExprVec2 {
    constructor() {
        super(expr_1.tag `gl_FragCoord.xy`, []);
    }
}
exports.FragCoordExpr = FragCoordExpr;
/**
 * creates an expression that evaluates to the frag coord in pixels (samplers
 * take normalized coordinates, so you might want [[nfcoord]] instead)
 */
function pixel() {
    return new FragCoordExpr();
}
exports.pixel = pixel;

},{"./expr":24}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fxaa = void 0;
const expr_1 = require("./expr");
const glslfunctions_1 = require("../glslfunctions");
/** FXAA expression */
class FXAAExpr extends expr_1.ExprVec4 {
    constructor() {
        super(expr_1.tag `fxaa()`, []);
        this.externalFuncs = [glslfunctions_1.glslFuncs.fxaa];
        this.needs.neighborSample = true;
    }
}
/** FXAA antaliasing expression */
function fxaa() {
    return new FXAAExpr();
}
exports.fxaa = fxaa;

},{"../glslfunctions":60,"./expr":24}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gaussian = exports.GaussianExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
/** gaussian expression */
class GaussianExpr extends expr_1.ExprFloat {
    constructor(x, a, b) {
        super(expr_1.tag `gaussian(${x}, ${a}, ${b})`, ["uFloatX", "uFloatA", "uFloatB"]);
        this.x = x;
        this.a = a;
        this.b = b;
        this.externalFuncs = [glslfunctions_1.glslFuncs.gaussian];
    }
    setX(x) {
        this.setUniform("uFloatX" + this.id, x);
        this.x = expr_1.wrapInValue(x);
    }
    setA(a) {
        this.setUniform("uFloatA" + this.id, a);
        this.a = expr_1.wrapInValue(a);
    }
    setB(b) {
        this.setUniform("uFloatB" + this.id, b);
        this.b = expr_1.wrapInValue(b);
    }
}
exports.GaussianExpr = GaussianExpr;
/**
 * gaussian function that defaults to normal distribution
 * @param x x position in the curve
 * @param a horizontal position of peak (defaults to 0 for normal distribution)
 * @param b horizontal stretch of the curve (defaults to 1 for normal distribution)
 */
function gaussian(x, a = 0, b = 1) {
    return new GaussianExpr(expr_1.wrapInValue(x), expr_1.wrapInValue(a), expr_1.wrapInValue(b));
}
exports.gaussian = gaussian;

},{"../glslfunctions":60,"./expr":24}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get4comp = exports.get3comp = exports.get2comp = exports.getcomp = exports.Get4CompExpr = exports.Get3CompExpr = exports.Get2CompExpr = exports.GetCompExpr = exports.checkLegalComponents = exports.typeStringToLength = void 0;
const expr_1 = require("./expr");
// TODO this should probably be somewhere else
/** @ignore */
function typeStringToLength(str) {
    switch (str) {
        case "float":
            return 1;
        case "vec2":
            return 2;
        case "vec3":
            return 3;
        case "vec4":
            return 4;
    }
}
exports.typeStringToLength = typeStringToLength;
/** @ignore */
function genCompSource(vec, components) {
    return {
        sections: ["", "." + components],
        values: [vec],
    };
}
/**
 * checks if components accessing a vector are legal. components can be illegal
 * if they mix sets (e.g. `v.rgzw`) or contain characters outside of any set
 * (e.g. `v.lmno`)
 * @param comps components string
 * @param vec vector being accessed
 */
function checkLegalComponents(comps, vec) {
    const check = (range, domain) => {
        let inside = 0;
        let outside = 0;
        for (const c of range) {
            domain.includes(c) ? inside++ : outside++;
        }
        return inside === inside && !outside;
    };
    const inLen = typeStringToLength(vec.typeString());
    const rgbaCheck = check(comps, "rgba".substr(0, inLen));
    const xyzwCheck = check(comps, "xyzw".substr(0, inLen));
    const stpqCheck = check(comps, "stpq".substr(0, inLen));
    if (!(rgbaCheck || xyzwCheck || stpqCheck)) {
        throw new Error("component sets are mixed or incorrect entirely");
    }
}
exports.checkLegalComponents = checkLegalComponents;
/**
 * performs all validity checks of [[checkLegalComponents]] and checks if the
 * number of accessed components does not exceed the size of the vector being
 * assigned to
 * @param comps components string
 * @param outLen length of the resultant vector
 * @param vec vector being accessed
 */
function checkGetComponents(comps, outLen, vec) {
    if (comps.length > outLen)
        throw new Error("too many components");
    checkLegalComponents(comps, vec);
}
/** get component expression */
class GetCompExpr extends expr_1.ExprFloat {
    constructor(vec, comps) {
        checkGetComponents(comps, 1, vec);
        super(genCompSource(vec, comps), ["uVec1Min"]);
        this.vec1Min = vec;
    }
    setVec(vec) {
        this.setUniform("uVec1Min", vec);
        this.vec1Min = vec;
    }
}
exports.GetCompExpr = GetCompExpr;
/** get 2 components expression */
class Get2CompExpr extends expr_1.ExprVec2 {
    constructor(vec, comps) {
        checkGetComponents(comps, 2, vec);
        super(genCompSource(vec, comps), ["uVec2Min"]);
        this.vec2Min = vec;
    }
    setVec(vec) {
        this.setUniform("uVec2Min", vec);
        this.vec2Min = vec;
    }
}
exports.Get2CompExpr = Get2CompExpr;
/** get 3 components expression */
class Get3CompExpr extends expr_1.ExprVec3 {
    constructor(vec, comps) {
        checkGetComponents(comps, 3, vec);
        super(genCompSource(vec, comps), ["uVec3Min"]);
        this.vec3Min = vec;
    }
    setVec(vec) {
        this.setUniform("uVec3Min", vec);
        this.vec3Min = vec;
    }
}
exports.Get3CompExpr = Get3CompExpr;
/** get 3 components expression */
class Get4CompExpr extends expr_1.ExprVec4 {
    constructor(vec, comps) {
        checkGetComponents(comps, 4, vec);
        super(genCompSource(vec, comps), ["uVec4Min"]);
        this.vec4Min = vec;
    }
    setVec(vec) {
        this.setUniform("uVec4Min", vec);
        this.vec4Min = vec;
    }
}
exports.Get4CompExpr = Get4CompExpr;
/**
 * creates an expression that gets 1 component from a vector
 * @param vec the vector to get components of
 * @param comps components string
 */
function getcomp(vec, comps) {
    return new GetCompExpr(vec, comps);
}
exports.getcomp = getcomp;
/**
 * creates an expression that gets 2 components from a vector
 * @param vec the vector to get components of
 * @param comps components string
 */
function get2comp(vec, comps) {
    return new Get2CompExpr(vec, comps);
}
exports.get2comp = get2comp;
/**
 * creates an expression that gets 3 components from a vector
 * @param vec the vector to get components of
 * @param comps components string
 */
function get3comp(vec, comps) {
    return new Get3CompExpr(vec, comps);
}
exports.get3comp = get3comp;
/**
 * creates an expression that gets 4 components from a vector
 * @param vec the vector to get components of
 * @param comps components string
 */
function get4comp(vec, comps) {
    return new Get4CompExpr(vec, comps);
}
exports.get4comp = get4comp;

},{"./expr":24}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.godrays = exports.GodRaysExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
const fragcolorexpr_1 = require("./fragcolorexpr");
const vecexprs_1 = require("./vecexprs");
/**
 * @ignore
 * the number of samples in the source code already
 */
const DEFAULT_SAMPLES = 100;
/** godrays expression */
class GodRaysExpr extends expr_1.ExprVec4 {
    // sane godray defaults from https://github.com/Erkaman/glsl-godrays/blob/master/example/index.js
    constructor(col = fragcolorexpr_1.fcolor(), exposure = expr_1.mut(1.0), decay = expr_1.mut(1.0), density = expr_1.mut(1.0), weight = expr_1.mut(0.01), lightPos = expr_1.mut(vecexprs_1.pvec2(0.5, 0.5)), samplerNum = 0, numSamples = DEFAULT_SAMPLES, convertDepth) {
        // TODO the metaprogramming here is not so good!
        // leaving off the function call section for now (we addd it back later)
        const sourceLists = expr_1.tag `${col}, ${exposure}, ${decay}, ${density}, ${weight}, ${lightPos}, ${convertDepth !== undefined ? convertDepth.threshold : expr_1.float(0)}, ${convertDepth !== undefined ? convertDepth.newColor : vecexprs_1.vec4(0, 0, 0, 0)})`;
        // TODO make this more generic
        // append the _<num> onto the function name
        // also add _depth if this is a version of the function that uses depth buffer
        const customName = `godrays${convertDepth !== undefined ? "_depth" : ""}${numSamples !== 100 ? "_s" + numSamples : ""}(`;
        sourceLists.sections[0] = customName;
        super(sourceLists, [
            "uCol",
            "uExposure",
            "uDecay",
            "uDensity",
            "uWeight",
            "uLightPos",
            "uThreshold",
            "uNewColor",
        ]);
        this.col = col;
        this.exposure = exposure;
        this.decay = decay;
        this.density = density;
        this.weight = weight;
        this.lightPos = lightPos;
        this.threshold = convertDepth === null || convertDepth === void 0 ? void 0 : convertDepth.threshold;
        this.newColor = convertDepth === null || convertDepth === void 0 ? void 0 : convertDepth.newColor;
        // will be 1 if needs to convert depth, and 0 otherwise
        this.funcIndex = ~~(convertDepth !== undefined);
        let customGodRayFunc = glslfunctions_1.glslFuncs.godrays
            .split("godrays(")
            .join(customName)
            .replace(`NUM_SAMPLES = ${DEFAULT_SAMPLES}`, "NUM_SAMPLES = " + numSamples);
        if (convertDepth !== undefined) {
            // with regex, uncomment the line in the source code that does the
            // conversion (if you think about it that's basically what a preprocessor
            // does...)
            customGodRayFunc = customGodRayFunc.replace(/\/\/uncomment\s/g, "");
            this.externalFuncs.push(glslfunctions_1.glslFuncs.depth2occlusion);
        }
        this.externalFuncs.push(customGodRayFunc);
        this.brandExprWithChannel(this.funcIndex, samplerNum);
    }
    /** sets the light color */
    setColor(color) {
        this.setUniform("uCol" + this.id, color);
        this.col = color;
    }
    /** sets the exposure */
    setExposure(exposure) {
        this.setUniform("uExposure" + this.id, exposure);
        this.exposure = expr_1.wrapInValue(exposure);
    }
    /** sets the decay */
    setDecay(decay) {
        this.setUniform("uDecay" + this.id, decay);
        this.decay = expr_1.wrapInValue(decay);
    }
    /** sets the density */
    setDensity(density) {
        this.setUniform("uDensity" + this.id, density);
        this.density = expr_1.wrapInValue(density);
    }
    /** sets the weight */
    setWeight(weight) {
        this.setUniform("uWeight" + this.id, weight);
        this.weight = expr_1.wrapInValue(weight);
    }
    /** sets the light position */
    setLightPos(lightPos) {
        this.setUniform("uLightPos" + this.id, lightPos);
        this.lightPos = lightPos;
    }
    // these only matter when you're using a depth buffer and not an occlusion
    // buffer (although right now, you'll still be able to set them)
    setThreshold(threshold) {
        this.setUniform("uThreshold" + this.id, threshold);
        this.threshold = expr_1.wrapInValue(threshold);
    }
    setNewColor(newColor) {
        this.setUniform("uNewColor" + this.id, newColor);
        this.newColor = newColor;
    }
}
exports.GodRaysExpr = GodRaysExpr;
/**
 * create a godrays expression which requires an occlusion map; all values are
 * mutable by default
 * @param options object that defines godrays properties (has sane defaults)
 */
function godrays(options = {}) {
    return new GodRaysExpr(options.color, expr_1.wrapInValue(options.exposure), expr_1.wrapInValue(options.decay), expr_1.wrapInValue(options.density), expr_1.wrapInValue(options.weight), options.lightPos, options.samplerNum, options.numSamples, options.convertDepth === undefined
        ? undefined
        : {
            threshold: expr_1.wrapInValue(options.convertDepth.threshold),
            newColor: options.convertDepth.newColor,
        });
}
exports.godrays = godrays;

},{"../glslfunctions":60,"./expr":24,"./fragcolorexpr":25,"./vecexprs":58}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grain = exports.GrainExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
// TODO consider getting rid of this since it's easy to make your own with
// `random` and `brightness`
/** grain expression */
class GrainExpr extends expr_1.ExprVec4 {
    constructor(grain) {
        super(expr_1.tag `vec4((1.0 - ${grain} * random(gl_FragCoord.xy)) * gl_FragColor.rgb, gl_FragColor.a);`, ["uGrain"]);
        this.grain = grain;
        this.externalFuncs = [glslfunctions_1.glslFuncs.random];
        this.needs.centerSample = true;
    }
    /** sets the grain level  */
    setGrain(grain) {
        this.setUniform("uGrain" + this.id, grain);
        this.grain = expr_1.wrapInValue(grain);
    }
}
exports.GrainExpr = GrainExpr;
/**
 * creates an expression that adds random grain
 * @param val how much the grain should impact the image (0 to 1 is reasonable)
 */
function grain(val) {
    return new GrainExpr(expr_1.wrapInValue(val));
}
exports.grain = grain;

},{"../glslfunctions":60,"./expr":24}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hsv2rgb = exports.HSVToRGBExpr = void 0;
const expr_1 = require("./expr");
const glslfunctions_1 = require("../glslfunctions");
/** HSV to RGB expression */
class HSVToRGBExpr extends expr_1.ExprVec4 {
    constructor(color) {
        super(expr_1.tag `hsv2rgb(${color})`, ["uHSVCol"]);
        this.color = color;
        this.externalFuncs = [glslfunctions_1.glslFuncs.hsv2rgb];
    }
    /** sets the color to convert */
    setColor(color) {
        this.setUniform("uHSVCol", color);
        this.color = color;
    }
}
exports.HSVToRGBExpr = HSVToRGBExpr;
/**
 * converts a color (with an alpha compoment) from hsv to rgb
 * @param col the hsva color to convert to rgba
 */
function hsv2rgb(col) {
    return new HSVToRGBExpr(col);
}
exports.hsv2rgb = hsv2rgb;

},{"../glslfunctions":60,"./expr":24}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invert = exports.InvertExpr = void 0;
const expr_1 = require("./expr");
const glslfunctions_1 = require("../glslfunctions");
/** invert expression */
class InvertExpr extends expr_1.ExprVec4 {
    constructor(color) {
        super(expr_1.tag `invert(${color})`, ["uColor"]);
        this.externalFuncs = [glslfunctions_1.glslFuncs.invert];
        this.color = color;
    }
    /** sets the color */
    setColor(color) {
        this.setUniform("uColor", color);
        this.color = color;
    }
}
exports.InvertExpr = InvertExpr;
/**
 * creates an expression that inverts the color, keeping the original alpha
 */
function invert(col) {
    return new InvertExpr(col);
}
exports.invert = invert;

},{"../glslfunctions":60,"./expr":24}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.len = exports.LenExpr = void 0;
const expr_1 = require("./expr");
/** length expression */
class LenExpr extends expr_1.ExprFloat {
    constructor(vec) {
        super(expr_1.tag `length(${vec})`, ["uVec"]);
        this.vec = vec;
    }
    setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
    }
}
exports.LenExpr = LenExpr;
/** creates an expreession that calculates the length of a vector */
function len(vec) {
    return new LenExpr(vec);
}
exports.len = len;

},{"./expr":24}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monochrome = exports.MonochromeExpr = void 0;
const expr_1 = require("./expr");
const glslfunctions_1 = require("../glslfunctions");
/** monochrome expression */
class MonochromeExpr extends expr_1.ExprVec4 {
    constructor(color) {
        super(expr_1.tag `monochrome(${color})`, ["uColor"]);
        this.externalFuncs = [glslfunctions_1.glslFuncs.monochrome];
        this.color = color;
    }
    /** sets the color */
    setColor(color) {
        this.setUniform("uColor", color);
        this.color = color;
    }
}
exports.MonochromeExpr = MonochromeExpr;
/**
 * creates an expression that converts a color into grayscale, keeping the
 * original alpha
 */
function monochrome(col) {
    return new MonochromeExpr(col);
}
exports.monochrome = monochrome;

},{"../glslfunctions":60,"./expr":24}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motionblur = exports.MotionBlurLoop = void 0;
const mergepass_1 = require("../mergepass");
const channelsampleexpr_1 = require("./channelsampleexpr");
const expr_1 = require("./expr");
const fragcolorexpr_1 = require("./fragcolorexpr");
const opexpr_1 = require("./opexpr");
/** frame averaging motion blur loop */
class MotionBlurLoop extends mergepass_1.EffectLoop {
    constructor(target = 0, persistence = expr_1.float(expr_1.mut(0.3))) {
        const col1 = opexpr_1.op(channelsampleexpr_1.channel(target), "*", persistence);
        const col2 = opexpr_1.op(fragcolorexpr_1.fcolor(), "*", opexpr_1.op(1, "-", persistence));
        const effects = [
            mergepass_1.loop([opexpr_1.op(col1, "+", col2)]).target(target),
            channelsampleexpr_1.channel(target),
        ];
        super(effects, { num: 1 });
        this.persistence = persistence;
    }
    /** set the persistence (keep between 0 and 1) */
    setPersistence(float) {
        if (!(this.persistence instanceof expr_1.BasicFloat))
            throw new Error("persistence expression not basic float");
        this.persistence.setVal(float);
    }
}
exports.MotionBlurLoop = MotionBlurLoop;
/**
 * creates a frame averaging motion blur effect
 * @param target the channel where your accumulation buffer is (defaults to 0,
 * which you might be using for something like the depth texture, so be sure to
 * change this to suit your needs)
 * @param persistence close to 0 is more ghostly, and close to 1 is nearly no
 * motion blur at all (defaults to 0.3)
 */
function motionblur(target, persistence) {
    return new MotionBlurLoop(target, expr_1.wrapInValue(persistence));
}
exports.motionblur = motionblur;

},{"../mergepass":62,"./channelsampleexpr":18,"./expr":24,"./fragcolorexpr":25,"./opexpr":42}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mouse = exports.MouseExpr = void 0;
const expr_1 = require("./expr");
/** mouse position expression */
class MouseExpr extends expr_1.ExprVec2 {
    constructor() {
        super(expr_1.tag `uMouse`, []);
        this.needs.mouseUniform = true;
    }
}
exports.MouseExpr = MouseExpr;
/**
 * creates an expression that evaluates to a vector representing the mouse
 * position in pixels
 */
function mouse() {
    return new MouseExpr();
}
exports.mouse = mouse;

},{"./expr":24}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.center = exports.NormCenterFragCoordExpr = void 0;
const expr_1 = require("./expr");
/** normalized centered frag coord expression */
class NormCenterFragCoordExpr extends expr_1.ExprVec2 {
    constructor() {
        super(expr_1.tag `(gl_FragCoord.xy / uResolution - 0.5)`, []);
    }
}
exports.NormCenterFragCoordExpr = NormCenterFragCoordExpr;
/**
 * creates an expression that calculates the normalized centered coord
 * (coordinates range from -0.5 to 0.5)
 */
function center() {
    return new NormCenterFragCoordExpr();
}
exports.center = center;

},{"./expr":24}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.norm = exports.NormExpr = void 0;
const expr_1 = require("./expr");
/** normalize expression */
class NormExpr extends expr_1.Operator {
    constructor(vec) {
        super(vec, expr_1.tag `normalize(${vec})`, ["uVec"]);
        this.vec = vec;
    }
    /** sets the vec to normalize */
    setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
    }
}
exports.NormExpr = NormExpr;
/** creates an expression that normalizes a vector */
function norm(vec) {
    return new NormExpr(vec);
}
exports.norm = norm;

},{"./expr":24}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pos = exports.NormFragCoordExpr = void 0;
const expr_1 = require("./expr");
/** normalized frag coord expression */
class NormFragCoordExpr extends expr_1.ExprVec2 {
    constructor() {
        // don't remove these parens! even if you think you are being clever about
        // order of operations
        super(expr_1.tag `(gl_FragCoord.xy / uResolution)`, []);
    }
}
exports.NormFragCoordExpr = NormFragCoordExpr;
/**
 * creates an expression that calculates the normalized frag coord (coordinates
 * range from 0 to 1)
 */
function pos() {
    return new NormFragCoordExpr();
}
exports.pos = pos;

},{"./expr":24}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nmouse = exports.NormMouseExpr = void 0;
const expr_1 = require("./expr");
/** normalized mouse position expression */
class NormMouseExpr extends expr_1.ExprVec2 {
    constructor() {
        super(expr_1.tag `(uMouse / uResolution.xy)`, []);
        this.needs.mouseUniform = true;
    }
}
exports.NormMouseExpr = NormMouseExpr;
/**
 * creates an expression that calculates the normalized mouse position
 * (coordinates range from 0 to 1)
 */
function nmouse() {
    return new NormMouseExpr();
}
exports.nmouse = nmouse;

},{"./expr":24}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.op = exports.OpExpr = void 0;
const expr_1 = require("./expr");
function genOpSourceList(left, op, right) {
    return {
        sections: ["(", ` ${op} `, ")"],
        values: [left, right],
    };
}
class OpExpr extends expr_1.Operator {
    constructor(left, op, right) {
        super(left, genOpSourceList(left, op, right), ["uLeft", "uRight"]);
        this.left = left;
        this.right = right;
    }
    setLeft(left) {
        this.setUniform("uLeft" + this.id, left);
        this.left = expr_1.wrapInValue(left);
    }
    setRight(right) {
        this.setUniform("uRight" + this.id, right);
        this.right = expr_1.wrapInValue(right);
    }
}
exports.OpExpr = OpExpr;
// implementation
/**
 * creates an arithmetic operator expression
 * @param left expression left of operator
 * @param op string representing arithmetic operator
 * @param right expression right of operator
 */
function op(left, op, right) {
    return new OpExpr(expr_1.wrapInValue(left), op, expr_1.wrapInValue(right));
}
exports.op = op;

},{"./expr":24}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fractalize = exports.perlin = exports.PerlinExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
const opexpr_1 = require("./opexpr");
/** Perlin noise expression */
class PerlinExpr extends expr_1.ExprFloat {
    // TODO include a default
    constructor(pos) {
        super(expr_1.tag `gradientnoise(${pos})`, ["uPos"]);
        this.pos = pos;
        this.externalFuncs = [glslfunctions_1.glslFuncs.random2, glslfunctions_1.glslFuncs.gradientnoise];
    }
    /** sets the position to calculate noise value of */
    setPos(pos) {
        this.setUniform("uPos", pos);
        this.pos = pos;
    }
}
exports.PerlinExpr = PerlinExpr;
/**
 * creates a perlin noise expression; values range from -1 to 1 but they tend
 * to be grayer than the [[simplex]] implementation
 * @param pos position
 */
function perlin(pos) {
    return new PerlinExpr(pos);
}
exports.perlin = perlin;
/**
 * take any function from a position to a float, and repeatedly sum calls to it
 * with doubling frequency and halving amplitude (works well with [[simplex]]
 * and [[perlin]])
 * @param pos position
 * @param octaves how many layers deep to make the fractal
 * @param func the function to fractalize
 */
function fractalize(pos, octaves, func) {
    if (octaves < 0)
        throw new Error("octaves can't be < 0");
    const recurse = (pos, size, level) => {
        if (level <= 0)
            return expr_1.pfloat(0);
        return opexpr_1.op(func(opexpr_1.op(pos, "/", size * 2)), "+", recurse(pos, size / 2, level - 1));
    };
    return recurse(pos, 0.5, octaves);
}
exports.fractalize = fractalize;

},{"../glslfunctions":60,"./expr":24,"./opexpr":42}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pblur = exports.PowerBlurLoop = void 0;
const mergepass_1 = require("../mergepass");
const blurexpr_1 = require("./blurexpr");
const vecexprs_1 = require("./vecexprs");
const expr_1 = require("./expr");
const baseLog = (x, y) => Math.log(y) / Math.log(x);
// TODO consider getting rid of this, as it pretty much never looks good
/** power blur loop */
class PowerBlurLoop extends mergepass_1.EffectLoop {
    constructor(size) {
        const side = blurexpr_1.gauss(expr_1.mut(vecexprs_1.pvec2(size, 0)));
        const up = blurexpr_1.gauss(expr_1.mut(vecexprs_1.pvec2(0, size)));
        const reps = Math.ceil(baseLog(2, size));
        super([side, up], {
            num: reps + 1,
        });
        this.size = size;
        this.loopInfo.func = (i) => {
            const distance = this.size / Math.pow(2, i);
            up.setDirection(vecexprs_1.pvec2(0, distance));
            side.setDirection(vecexprs_1.pvec2(distance, 0));
        };
    }
    /** sets the size of the radius */
    setSize(size) {
        this.size = size;
        this.loopInfo.num = Math.ceil(baseLog(2, size));
    }
}
exports.PowerBlurLoop = PowerBlurLoop;
/**
 * fast approximate blur for large blur radius that might look good in some cases
 * @param size the radius of the blur
 */
function pblur(size) {
    return new PowerBlurLoop(size);
}
exports.pblur = pblur;

},{"../mergepass":62,"./blurexpr":15,"./expr":24,"./vecexprs":58}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = exports.RandomExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
const normfragcoordexpr_1 = require("./normfragcoordexpr");
/** psuedorandom number expression */
class RandomExpr extends expr_1.ExprFloat {
    constructor(seed = normfragcoordexpr_1.pos()) {
        super(expr_1.tag `random(${seed})`, ["uSeed"]);
        this.seed = seed;
        this.externalFuncs = [glslfunctions_1.glslFuncs.random];
    }
    /** sets the seed (vary this over time to get a moving effect) */
    setSeed(seed) {
        this.setUniform("uSeed", seed);
        this.seed = seed;
    }
}
exports.RandomExpr = RandomExpr;
/**
 * creates expression that evaluates to a pseudorandom number between 0 and 1
 * @param seed vec2 to to seed the random number (defaults to the normalized
 * frag coord)
 */
function random(seed) {
    return new RandomExpr(seed);
}
exports.random = random;

},{"../glslfunctions":60,"./expr":24,"./normfragcoordexpr":40}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.region = void 0;
const mergepass_1 = require("../mergepass");
const expr_1 = require("./expr");
const getcompexpr_1 = require("./getcompexpr");
const normfragcoordexpr_1 = require("./normfragcoordexpr");
const opexpr_1 = require("./opexpr");
const ternaryexpr_1 = require("./ternaryexpr");
const fragcolorexpr_1 = require("./fragcolorexpr");
// form: x1, y1, x2, y2
function createDifferenceFloats(floats) {
    const axes = "xy";
    const differences = [];
    if (floats.length !== 4) {
        throw new Error("incorrect amount of points specified for region");
    }
    for (let i = 0; i < 2; i++) {
        differences.push(opexpr_1.op(getcompexpr_1.getcomp(normfragcoordexpr_1.pos(), axes[i]), "-", floats[i]));
    }
    for (let i = 2; i < floats.length; i++) {
        differences.push(opexpr_1.op(floats[i], "-", getcompexpr_1.getcomp(normfragcoordexpr_1.pos(), axes[i - 2])));
    }
    return differences;
}
/**
 * restrict an effect to a region of the screen
 * @param space top left, top right, bottom left, bottom right corners of the
 * region, or just a number if you wish to sample from a channel as the region
 * @param success expression for being inside the region
 * @param failure expression for being outside the region
 * @param not whether to invert the region
 */
function region(space, success, failure, not = false) {
    const floats = Array.isArray(space)
        ? space.map((f) => expr_1.wrapInValue(f))
        : typeof space === "number"
            ? expr_1.wrapInValue(space)
            : space;
    if (failure instanceof mergepass_1.EffectLoop) {
        if (!(success instanceof mergepass_1.EffectLoop)) {
            [success, failure] = [failure, success]; // swap the order
            not = !not; // invert the region
        }
    }
    if (success instanceof mergepass_1.EffectLoop) {
        if (!(failure instanceof mergepass_1.EffectLoop)) {
            return success.regionWrap(floats, failure, true, not);
        }
        // double loop, so we have to do separately
        return mergepass_1.loop([
            success.regionWrap(floats, fragcolorexpr_1.fcolor(), false, not),
            failure.regionWrap(floats, fragcolorexpr_1.fcolor(), true, !not),
        ]);
    }
    return ternaryexpr_1.ternary(Array.isArray(floats) ? createDifferenceFloats(floats) : floats, success.brandExprWithRegion(floats), failure.brandExprWithRegion(floats), not);
}
exports.region = region;

},{"../mergepass":62,"./expr":24,"./fragcolorexpr":25,"./getcompexpr":29,"./normfragcoordexpr":40,"./opexpr":42,"./ternaryexpr":54}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolution = exports.ResolutionExpr = void 0;
const expr_1 = require("./expr");
/** resolution expression */
class ResolutionExpr extends expr_1.ExprVec2 {
    constructor() {
        super(expr_1.tag `uResolution`, []);
    }
}
exports.ResolutionExpr = ResolutionExpr;
/** creates an expression that evaluates to a vector representing the resolution */
function resolution() {
    return new ResolutionExpr();
}
exports.resolution = resolution;

},{"./expr":24}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgb2hsv = exports.RGBToHSVExpr = void 0;
const expr_1 = require("./expr");
const glslfunctions_1 = require("../glslfunctions");
/** RGB to HSV expression */
class RGBToHSVExpr extends expr_1.ExprVec4 {
    constructor(color) {
        super(expr_1.tag `rgb2hsv(${color})`, ["uRGBCol"]);
        this.color = color;
        this.externalFuncs = [glslfunctions_1.glslFuncs.rgb2hsv];
    }
    /** sets the color to convert */
    setColor(color) {
        this.setUniform("uRGBCol", color);
        this.color = color;
    }
}
exports.RGBToHSVExpr = RGBToHSVExpr;
/**
 * creates an expression that converts a color (with an alpha component) from
 * rgb to hsv
 * @param col the rgba color to convert to hsva
 */
function rgb2hsv(col) {
    return new RGBToHSVExpr(col);
}
exports.rgb2hsv = rgb2hsv;

},{"../glslfunctions":60,"./expr":24}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotate = exports.RotateExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
/** rotate expression */
class RotateExpr extends expr_1.ExprVec2 {
    constructor(vec, angle) {
        super(expr_1.tag `rotate2d(${vec}, ${angle})`, ["uVec", "uAngle"]);
        this.vec = vec;
        this.angle = angle;
        this.externalFuncs = [glslfunctions_1.glslFuncs.rotate2d];
    }
    /** set the vector to rotate */
    setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
    }
    /** set the angle to rotate by */
    setAngle(angle) {
        this.setUniform("uAngle" + this.id, angle);
        this.angle = expr_1.wrapInValue(angle);
    }
}
exports.RotateExpr = RotateExpr;
/**
 * creates an expression that rotates a vector by a given angle
 * @param vec the vector to rotate
 * @param angle radians to rotate vector by
 */
function rotate(vec, angle) {
    return new RotateExpr(vec, expr_1.wrapInValue(angle));
}
exports.rotate = rotate;

},{"../glslfunctions":60,"./expr":24}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.input = exports.SceneSampleExpr = void 0;
const expr_1 = require("./expr");
const normfragcoordexpr_1 = require("./normfragcoordexpr");
/** scene sample expression */
class SceneSampleExpr extends expr_1.ExprVec4 {
    constructor(coord = normfragcoordexpr_1.pos()) {
        super(expr_1.tag `texture2D(uSceneSampler, ${coord})`, ["uCoord"]);
        this.coord = coord;
        this.needs.sceneBuffer = true;
    }
    /** sets coordinate where scene is being sampled from */
    setCoord(coord) {
        this.setUniform("uCoord", coord);
        this.coord = coord;
    }
}
exports.SceneSampleExpr = SceneSampleExpr;
/**
 * creates an expression that samples the original scene
 * @param vec where to sample the original scene texture (defaults to the
 * normalized frag coord, but change this if you want to transform the
 * coordinate space of the original image)
 */
function input(vec) {
    return new SceneSampleExpr(vec);
}
exports.input = input;

},{"./expr":24,"./normfragcoordexpr":40}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetColorExpr = void 0;
const expr_1 = require("./expr");
/**
 * set fragment color expression (not needed for the user; used internally for
 * wrapping any kind of [[Vec4]] in an [[ExprVec4]])
 */
class SetColorExpr extends expr_1.ExprVec4 {
    constructor(vec) {
        super(expr_1.tag `(${vec})`, ["uVal"]);
        this.vec = vec;
    }
}
exports.SetColorExpr = SetColorExpr;

},{"./expr":24}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplex = exports.SimplexNoise = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
/** simplex noise expression */
class SimplexNoise extends expr_1.ExprFloat {
    constructor(pos) {
        super(expr_1.tag `simplexnoise(${pos})`, ["uPos"]);
        this.pos = pos;
        this.externalFuncs = [glslfunctions_1.glslFuncs.simplexhelpers, glslfunctions_1.glslFuncs.simplexnoise];
    }
    setPos(pos) {
        this.setUniform("uPos", pos);
        this.pos = pos;
    }
}
exports.SimplexNoise = SimplexNoise;
/**
 * creates a simplex noise expression; values range from -1 to 1
 * @param pos position
 */
function simplex(pos) {
    return new SimplexNoise(pos);
}
exports.simplex = simplex;

},{"../glslfunctions":60,"./expr":24}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sobel = exports.SobelExpr = void 0;
const glslfunctions_1 = require("../glslfunctions");
const expr_1 = require("./expr");
/** Sobel edge detection expression */
class SobelExpr extends expr_1.ExprVec4 {
    constructor(samplerNum) {
        super(expr_1.tag `sobel()`, []);
        this.externalFuncs = [glslfunctions_1.glslFuncs.sobel];
        this.brandExprWithChannel(0, samplerNum);
    }
}
exports.SobelExpr = SobelExpr;
/**
 * creates a Sobel edge detection expression that outputs the raw result; for
 * more highly processed edge detection expressions, see [[edgecolor]] or
 * [[edge]]
 * @param samplerNum where to sample from
 */
function sobel(samplerNum) {
    return new SobelExpr(samplerNum);
}
exports.sobel = sobel;

},{"../glslfunctions":60,"./expr":24}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ternary = exports.TernaryExpr = void 0;
const expr_1 = require("./expr");
function genTernarySourceList(floats, success, failure, not) {
    const sourceList = {
        sections: [`(${not ? "!" : ""}(`],
        values: [],
    };
    let counter = 0;
    // generate the boolean expression
    if (floats !== null) {
        for (const f of floats) {
            counter++;
            const last = counter === floats.length;
            sourceList.values.push(f);
            sourceList.sections.push(` > 0.${last ? ") ? " : " && "}`);
        }
    }
    else {
        sourceList.sections[0] += "uCount == 0) ? ";
    }
    // generate the success expression and colon
    sourceList.values.push(success);
    sourceList.sections.push(" : ");
    // generate the failure expression
    sourceList.values.push(failure);
    sourceList.sections.push(")");
    return sourceList;
}
class TernaryExpr extends expr_1.Operator {
    constructor(floats, success, failure, not) {
        super(success, genTernarySourceList(floats, success, failure, not), [
            ...(floats !== null
                ? Array.from(floats, (val, index) => "uFloat" + index)
                : []),
            "uSuccess",
            "uFailure",
        ]);
        this.success = success;
        this.failure = failure;
        this.needs.passCount = floats === null;
    }
}
exports.TernaryExpr = TernaryExpr;
/**
 * creates a ternary expression; the boolean expression is if all the floats
 * given are greater than 0
 * @param floats if all these floats (or the single float) are above 0, then
 * evaluates to success expression
 * @param success
 * @param failure
 * @param not whether to invert the ternary
 */
function ternary(floats, success, failure, not = false) {
    // TODO make this type safe (ran into a type error here)
    // wrap single float in array if need be
    if (!Array.isArray(floats) && floats !== null)
        floats = [floats].map((f) => expr_1.wrapInValue(f));
    // TODO get rid of this cast
    return new TernaryExpr(floats, expr_1.wrapInValue(success), expr_1.wrapInValue(failure), not);
}
exports.ternary = ternary;

},{"./expr":24}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = exports.TimeExpr = void 0;
const expr_1 = require("./expr");
/** time expression */
class TimeExpr extends expr_1.ExprFloat {
    constructor() {
        super(expr_1.tag `uTime`, []);
        this.needs.timeUniform = true;
    }
}
exports.TimeExpr = TimeExpr;
/** creates a time expression that evaluates to the current time */
function time() {
    return new TimeExpr();
}
exports.time = time;

},{"./expr":24}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = exports.TranslateExpr = void 0;
const expr_1 = require("./expr");
// really just adding two vecs together, but it might be confusing that there's
// rotate but no translate, so this is included. also it could make some
// operations more readable
/** sets the translate expression */
class TranslateExpr extends expr_1.ExprVec2 {
    constructor(vec, pos) {
        super(expr_1.tag `(${vec} + ${pos})`, ["uVec", "uPos"]);
        this.vec = vec;
        this.pos = pos;
    }
    /** sets the starting position */
    setVec(vec) {
        this.setUniform("uVec" + this.id, vec);
        this.vec = vec;
    }
    /** sets how far the vector will be translated */
    setPos(pos) {
        this.setUniform("uPos" + this.id, pos);
        this.pos = pos;
    }
}
exports.TranslateExpr = TranslateExpr;
/** translates the position of a vector by another vector */
function translate(vec, pos) {
    return new TranslateExpr(vec, pos);
}
exports.translate = translate;

},{"./expr":24}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truedepth = exports.TrueDepthExpr = void 0;
const expr_1 = require("./expr");
const glslfunctions_1 = require("../glslfunctions");
/** true depth expression */
class TrueDepthExpr extends expr_1.ExprFloat {
    constructor(depth) {
        super(expr_1.tag `truedepth(${depth})`, ["uDist"]);
        this.depth = depth;
        this.externalFuncs = [glslfunctions_1.glslFuncs.truedepth];
    }
    /** sets the distance to convert to the true depth */
    setDist(depth) {
        this.setUniform("uDist", depth);
        this.depth = expr_1.wrapInValue(depth);
    }
}
exports.TrueDepthExpr = TrueDepthExpr;
/** calculates the linear depth from inverse depth value `1 / distance` */
function truedepth(depth) {
    return new TrueDepthExpr(expr_1.wrapInValue(depth));
}
exports.truedepth = truedepth;

},{"../glslfunctions":60,"./expr":24}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pvec4 = exports.pvec3 = exports.pvec2 = exports.vec4 = exports.vec3 = exports.vec2 = void 0;
const expr_1 = require("./expr");
/** @ignore */
function vecSourceList(...components) {
    const sections = ["vec" + components.length + "("];
    for (let i = 0; i < components.length - 1; i++) {
        sections.push(", ");
    }
    const defaultNames = [];
    for (let i = 0; i < components.length; i++) {
        defaultNames.push("uComp" + i);
    }
    sections.push(")");
    return [{ sections: sections, values: components }, defaultNames];
}
// expression vector shorthands
/** creates a basic vec2 expression */
function vec2(comp1, comp2) {
    return new expr_1.BasicVec2(...vecSourceList(...[comp1, comp2].map((c) => expr_1.wrapInValue(c))));
}
exports.vec2 = vec2;
/** creates a basic vec3 expression */
function vec3(comp1, comp2, comp3) {
    return new expr_1.BasicVec3(...vecSourceList(...[comp1, comp2, comp3].map((c) => expr_1.wrapInValue(c))));
}
exports.vec3 = vec3;
/** creates a basic vec4 expression */
function vec4(comp1, comp2, comp3, comp4) {
    return new expr_1.BasicVec4(...vecSourceList(...[comp1, comp2, comp3, comp4].map((c) => expr_1.wrapInValue(c))));
}
exports.vec4 = vec4;
// primitive vector shorthands
/** creates a primitive vec2 expression */
function pvec2(comp1, comp2) {
    return new expr_1.PrimitiveVec2([comp1, comp2]);
}
exports.pvec2 = pvec2;
/** creates a primitive vec3 expression */
function pvec3(comp1, comp2, comp3) {
    return new expr_1.PrimitiveVec3([comp1, comp2, comp3]);
}
exports.pvec3 = pvec3;
/** creates a primitive vec4 expression */
function pvec4(comp1, comp2, comp3, comp4) {
    return new expr_1.PrimitiveVec4([comp1, comp2, comp3, comp4]);
}
exports.pvec4 = pvec4;

},{"./expr":24}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.glslFuncs = void 0;
// adapted from The Book of Shaders
/** glsl source code for external functions */
exports.glslFuncs = {
    // TODO bad to calculate single pixel width every time; maybe it can be a need
    texture2D_region: `vec4 texture2D_region(
  float r_x_min,
  float r_y_min,
  float r_x_max,
  float r_y_max,
  sampler2D sampler,
  vec2 uv
) {
  vec2 d = vec2(1., 1.) / uResolution; // pixel width
  return texture2D(sampler, clamp(uv, vec2(r_x_min + d.x, r_y_min + d.x), vec2(r_x_max - d.y, r_y_max - d.y)));
}`,
    // TODO replace with a better one
    // adapted from The Book of Shaders
    random: `float random(vec2 st) {
  return fract(sin(dot(st.xy / 99., vec2(12.9898, 78.233))) * 43758.5453123);
}`,
    // adapted from The Book of Shaders
    random2: `vec2 random2(vec2 st) {
  st = vec2(dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}`,
    rotate2d: `vec2 rotate2d(vec2 v, float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * v;
}`,
    // adapted from The Book of Shaders
    hsv2rgb: `vec4 hsv2rgb(vec4 co){
  vec3 c = co.xyz;
  vec3 rgb = clamp(abs(mod(
    c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  vec3 hsv = c.z * mix(vec3(1.0), rgb, c.y);
  return vec4(hsv.x, hsv.y, hsv.z, co.a);
}`,
    // adapted from The Book of Shaders
    rgb2hsv: `vec4 rgb2hsv(vec4 co){
  vec3 c = co.rgb;
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec4(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
              d / (q.x + e),
              q.x, co.a);
}`,
    // all gaussian blurs adapted from:
    // https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/5.glsl
    gauss5: `vec4 gauss5(vec2 dir) {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 col = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * dir;
  col += texture2D(uSampler, uv) * 0.29411764705882354;
  col += texture2D(uSampler, uv + (off1 / uResolution)) * 0.35294117647058826;
  col += texture2D(uSampler, uv - (off1 / uResolution)) * 0.35294117647058826;
  return col;
}`,
    gauss9: `vec4 gauss9(vec2 dir) {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 col = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * dir;
  vec2 off2 = vec2(3.2307692308) * dir;
  col += texture2D(uSampler, uv) * 0.2270270270;
  col += texture2D(uSampler, uv + (off1 / uResolution)) * 0.3162162162;
  col += texture2D(uSampler, uv - (off1 / uResolution)) * 0.3162162162;
  col += texture2D(uSampler, uv + (off2 / uResolution)) * 0.0702702703;
  col += texture2D(uSampler, uv - (off2 / uResolution)) * 0.0702702703;
  return col;
}`,
    gauss13: `vec4 gauss13(vec2 dir) {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 col = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * dir;
  vec2 off2 = vec2(3.2941176470588234) * dir;
  vec2 off3 = vec2(5.176470588235294) * dir;
  col += texture2D(uSampler, uv) * 0.1964825501511404;
  col += texture2D(uSampler, uv + (off1 / uResolution)) * 0.2969069646728344;
  col += texture2D(uSampler, uv - (off1 / uResolution)) * 0.2969069646728344;
  col += texture2D(uSampler, uv + (off2 / uResolution)) * 0.09447039785044732;
  col += texture2D(uSampler, uv - (off2 / uResolution)) * 0.09447039785044732;
  col += texture2D(uSampler, uv + (off3 / uResolution)) * 0.010381362401148057;
  col += texture2D(uSampler, uv - (off3 / uResolution)) * 0.010381362401148057;
  return col;
}`,
    contrast: `vec4 contrast(float val, vec4 col) {
  col.rgb /= col.a;
  col.rgb = ((col.rgb - 0.5) * val) + 0.5;
  col.rgb *= col.a;
  return col;
}`,
    brightness: `vec4 brightness(float val, vec4 col) {
  col.rgb /= col.a;
  col.rgb += val;
  col.rgb *= col.a;
  return col;
}`,
    // adapted from https://www.shadertoy.com/view/ls3GWS which was adapted from
    // http://www.geeks3d.com/20110405/fxaa-fast-approximate-anti-aliasing-demo-glsl-opengl-test-radeon-geforce/3/
    // original algorithm created by Timothy Lottes
    fxaa: `vec4 fxaa() {
  float FXAA_SPAN_MAX = 8.0;
  float FXAA_REDUCE_MUL = 1.0 / FXAA_SPAN_MAX;
  float FXAA_REDUCE_MIN = 1.0 / 128.0;
  float FXAA_SUBPIX_SHIFT = 1.0 / 4.0;

  vec2 rcpFrame = 1. / uResolution.xy;
  vec2 t_uv = gl_FragCoord.xy / uResolution.xy; 
  vec4 uv = vec4(t_uv, t_uv - (rcpFrame * (0.5 + FXAA_SUBPIX_SHIFT)));

  vec3 rgbNW = texture2D(uSampler, uv.zw).xyz;
  vec3 rgbNE = texture2D(uSampler, uv.zw + vec2(1,0) * rcpFrame.xy).xyz;
  vec3 rgbSW = texture2D(uSampler, uv.zw + vec2(0,1) * rcpFrame.xy).xyz;
  vec3 rgbSE = texture2D(uSampler, uv.zw + vec2(1,1) * rcpFrame.xy).xyz;
  vec4 rgbMfull = texture2D(uSampler, uv.xy);
  vec3 rgbM = rgbMfull.xyz;
  float alpha = rgbMfull.a;

  vec3 luma = vec3(0.299, 0.587, 0.114);
  float lumaNW = dot(rgbNW, luma);
  float lumaNE = dot(rgbNE, luma);
  float lumaSW = dot(rgbSW, luma);
  float lumaSE = dot(rgbSE, luma);
  float lumaM = dot(rgbM,  luma);

  float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
  float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

  vec2 dir;
  dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
  dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));

  float dirReduce = max(
    (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
  float rcpDirMin = 1.0/(min(abs(dir.x), abs(dir.y)) + dirReduce);

  dir = min(vec2(FXAA_SPAN_MAX,  FXAA_SPAN_MAX),
    max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
    dir * rcpDirMin)) * rcpFrame.xy;

  vec3 rgbA = (1.0 / 2.0) * (
    texture2D(uSampler, uv.xy + dir * (1.0 / 3.0 - 0.5)).xyz +
    texture2D(uSampler, uv.xy + dir * (2.0 / 3.0 - 0.5)).xyz);
  vec3 rgbB = rgbA * (1.0 / 2.0) + (1.0 / 4.0) * (
    texture2D(uSampler, uv.xy + dir * (0.0 / 3.0 - 0.5)).xyz +
    texture2D(uSampler, uv.xy + dir * (3.0 / 3.0 - 0.5)).xyz);

  float lumaB = dot(rgbB, luma);

  if (lumaB < lumaMin || lumaB > lumaMax) {
    return vec4(rgbA.r, rgbA.g, rgbA.b, alpha);
  }

  return vec4(rgbB.r, rgbB.g, rgbB.b, alpha);
}`,
    // normal curve is a = 0 and b = 1
    gaussian: `float gaussian(float x, float a, float b) {
  float e = 2.71828;
  return pow(e, -pow(x - a, 2.) / b);
}`,
    // for calculating the true distance from 0 to 1 depth buffer
    // the small delta is to prevent division by zero, which is undefined behavior
    truedepth: `float truedepth(float i) {
  i = max(i, 0.00000001);
  return (1. - i) / i;
}`,
    // based off of https://fabiensanglard.net/lightScattering/index.php
    godrays: `vec4 godrays(
  vec4 col,
  float exposure,
  float decay,
  float density,
  float weight,
  vec2 lightPos,
  float threshold,
  vec4 newColor
) {
  vec2 texCoord = gl_FragCoord.xy / uResolution;
  vec2 deltaTexCoord = texCoord - lightPos;

  const int NUM_SAMPLES = 100;
  deltaTexCoord *= 1. / float(NUM_SAMPLES) * density;
  float illuminationDecay = 1.0;

  for (int i=0; i < NUM_SAMPLES; i++) {
    texCoord -= deltaTexCoord;
    vec4 sample = texture2D(uSampler, texCoord);
    //uncomment sample = depth2occlusion(sample, newColor, threshold);
    sample *= illuminationDecay * weight;
    col += sample;
    illuminationDecay *= decay;
  }
  return col * exposure;
}`,
    depth2occlusion: `vec4 depth2occlusion(vec4 depthCol, vec4 newCol, float threshold) {
  float red = 1. - ceil(depthCol.r - threshold);
  return vec4(newCol.rgb * red, 1.0);
}`,
    // adapted from The Book of Shaders, which was adapted from Inigo Quilez
    // from this example: https://www.shadertoy.com/view/XdXGW8
    gradientnoise: `float gradientnoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(mix(dot(random2(i + vec2(0.0,0.0)), f - vec2(0.0, 0.0)),
                     dot(random2(i + vec2(1.0,0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(random2(i + vec2(0.0,1.0)), f - vec2(0.0, 1.0)),
                 dot(random2(i + vec2(1.0,1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}`,
    // adapted from The Book of Shaders
    // https://thebookofshaders.com/edit.php#11/2d-snoise-clear.frag
    // this was adapted from this fast implementation
    // https://github.com/ashima/webgl-noise
    // simplex noise invented by Ken Perlin
    simplexnoise: `float simplexnoise(vec2 v) {
  // Precompute values for skewed triangular grid
  const vec4 C = vec4(0.211324865405187,
                      // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,
                      // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626,
                      // -1.0 + 2.0 * C.x
                      0.024390243902439);
                      // 1.0 / 41.0

  // First corner (x0)
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  // Other two corners (x1, x2)
  vec2 i1 = vec2(0.0);
  i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
  vec2 x1 = x0.xy + C.xx - i1;
  vec2 x2 = x0.xy + C.zz;

  // Do some permutations to avoid
  // truncation effects in permutation
  i = mod289_2(i);
  vec3 p = permute(
          permute( i.y + vec3(0.0, i1.y, 1.0))
              + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(
                      dot(x0,x0),
                      dot(x1,x1),
                      dot(x2,x2)
                      ), 0.0);

  m = m*m ;
  m = m*m ;

  // Gradients:
  //  41 pts uniformly over a line, mapped onto a diamond
  //  The ring size 17*17 = 289 is close to a multiple
  //      of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt(a0*a0 + h*h);
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

  // Compute final noise value at P
  vec3 g = vec3(0.0);
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
  return 130.0 * dot(m, g);
}`,
    // only useful for simplex noise
    simplexhelpers: `vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289_2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289_3(((x*34.0)+1.0)*x); }`,
    // sobel adapted from https://gist.github.com/Hebali/6ebfc66106459aacee6a9fac029d0115
    sobel: `vec4 sobel() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 k[8];

  float w = 1. / uResolution.x;
  float h = 1. / uResolution.y;

  k[0] = texture2D(uSampler, uv + vec2(-w, -h));
  k[1] = texture2D(uSampler, uv + vec2(0., -h));
  k[2] = texture2D(uSampler, uv + vec2(w, -h));
  k[3] = texture2D(uSampler, uv + vec2(-w, 0.));

  k[4] = texture2D(uSampler, uv + vec2(w, 0.));
  k[5] = texture2D(uSampler, uv + vec2(-w, h));
  k[6] = texture2D(uSampler, uv + vec2(0., h));
  k[7] = texture2D(uSampler, uv + vec2(w, h));

  vec4 edge_h = k[2] + (2. * k[4]) + k[7] - (k[0] + (2. * k[3]) + k[5]);
  vec4 edge_v = k[0] + (2. * k[1]) + k[2] - (k[5] + (2. * k[6]) + k[7]);
  vec4 sob = sqrt(edge_h * edge_h + edge_v * edge_v);

  return vec4(1. - sob.rgb, 1.);
}`,
    // inlining a similar function will substitute in the full expression for
    // every component, so it's more efficient to have a function
    monochrome: `vec4 monochrome(vec4 col) {
  return vec4(vec3((col.r + col.g + col.b) / 3.), col.a);
}`,
    invert: `vec4 invert(vec4 col) {
  return vec4(vec3(1., 1., 1.) - col.rgb, col.a);
}`,
    channel: `vec4 channel(vec2 uv, sampler2D sampler) {
  return texture2D(sampler, uv);
}`,
};

},{}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./mergepass"), exports);
__exportStar(require("./exprtypes"), exports);
__exportStar(require("./glslfunctions"), exports);
__exportStar(require("./settings"), exports);
__exportStar(require("./exprs/blurexpr"), exports);
__exportStar(require("./exprs/fragcolorexpr"), exports);
__exportStar(require("./exprs/vecexprs"), exports);
__exportStar(require("./exprs/opexpr"), exports);
__exportStar(require("./exprs/powerblur"), exports);
__exportStar(require("./exprs/blur2dloop"), exports);
__exportStar(require("./exprs/lenexpr"), exports);
__exportStar(require("./exprs/normexpr"), exports);
__exportStar(require("./exprs/fragcoordexpr"), exports);
__exportStar(require("./exprs/normfragcoordexpr"), exports);
__exportStar(require("./exprs/normcenterfragcoordexpr"), exports);
__exportStar(require("./exprs/scenesampleexpr"), exports);
__exportStar(require("./exprs/brightnessexpr"), exports);
__exportStar(require("./exprs/contrastexpr"), exports);
__exportStar(require("./exprs/grainexpr"), exports);
__exportStar(require("./exprs/getcompexpr"), exports);
__exportStar(require("./exprs/changecompexpr"), exports);
__exportStar(require("./exprs/rgbtohsvexpr"), exports);
__exportStar(require("./exprs/hsvtorgbexpr"), exports);
__exportStar(require("./exprs/timeexpr"), exports);
__exportStar(require("./exprs/arity1"), exports);
__exportStar(require("./exprs/arity2"), exports);
__exportStar(require("./exprs/fxaaexpr"), exports);
__exportStar(require("./exprs/channelsampleexpr"), exports);
__exportStar(require("./exprs/dofloop"), exports);
__exportStar(require("./exprs/truedepthexpr"), exports);
__exportStar(require("./exprs/godraysexpr"), exports);
__exportStar(require("./exprs/depthtoocclusionexpr"), exports);
__exportStar(require("./exprs/resolutionexpr"), exports);
__exportStar(require("./exprs/mouseexpr"), exports);
__exportStar(require("./exprs/rotateexpr"), exports);
__exportStar(require("./exprs/translateexpr"), exports);
__exportStar(require("./exprs/normmouseexpr"), exports);
__exportStar(require("./exprs/perlinexpr"), exports);
__exportStar(require("./exprs/simplexexpr"), exports);
__exportStar(require("./exprs/motionblurloop"), exports);
__exportStar(require("./exprs/randomexpr"), exports);
__exportStar(require("./exprs/sobelexpr"), exports);
__exportStar(require("./exprs/bloomloop"), exports);
__exportStar(require("./exprs/monochromeexpr"), exports);
__exportStar(require("./exprs/invertexpr"), exports);
__exportStar(require("./exprs/edgeexpr"), exports);
__exportStar(require("./exprs/edgecolorexpr"), exports);
__exportStar(require("./exprs/ternaryexpr"), exports);
__exportStar(require("./exprs/regiondecorator"), exports);
__exportStar(require("./exprs/expr"), exports);

},{"./exprs/arity1":11,"./exprs/arity2":12,"./exprs/bloomloop":13,"./exprs/blur2dloop":14,"./exprs/blurexpr":15,"./exprs/brightnessexpr":16,"./exprs/changecompexpr":17,"./exprs/channelsampleexpr":18,"./exprs/contrastexpr":19,"./exprs/depthtoocclusionexpr":20,"./exprs/dofloop":21,"./exprs/edgecolorexpr":22,"./exprs/edgeexpr":23,"./exprs/expr":24,"./exprs/fragcolorexpr":25,"./exprs/fragcoordexpr":26,"./exprs/fxaaexpr":27,"./exprs/getcompexpr":29,"./exprs/godraysexpr":30,"./exprs/grainexpr":31,"./exprs/hsvtorgbexpr":32,"./exprs/invertexpr":33,"./exprs/lenexpr":34,"./exprs/monochromeexpr":35,"./exprs/motionblurloop":36,"./exprs/mouseexpr":37,"./exprs/normcenterfragcoordexpr":38,"./exprs/normexpr":39,"./exprs/normfragcoordexpr":40,"./exprs/normmouseexpr":41,"./exprs/opexpr":42,"./exprs/perlinexpr":43,"./exprs/powerblur":44,"./exprs/randomexpr":45,"./exprs/regiondecorator":46,"./exprs/resolutionexpr":47,"./exprs/rgbtohsvexpr":48,"./exprs/rotateexpr":49,"./exprs/scenesampleexpr":50,"./exprs/simplexexpr":52,"./exprs/sobelexpr":53,"./exprs/ternaryexpr":54,"./exprs/timeexpr":55,"./exprs/translateexpr":56,"./exprs/truedepthexpr":57,"./exprs/vecexprs":58,"./exprtypes":59,"./glslfunctions":60,"./mergepass":62,"./settings":63}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTexture = exports.makeTexture = exports.Merger = exports.loop = exports.EffectLoop = exports.EffectDictionary = void 0;
const codebuilder_1 = require("./codebuilder");
const expr_1 = require("./exprs/expr");
const fragcolorexpr_1 = require("./exprs/fragcolorexpr");
const regiondecorator_1 = require("./exprs/regiondecorator");
const scenesampleexpr_1 = require("./exprs/scenesampleexpr");
const setcolorexpr_1 = require("./exprs/setcolorexpr");
const ternaryexpr_1 = require("./exprs/ternaryexpr");
const settings_1 = require("./settings");
const webglprogramloop_1 = require("./webglprogramloop");
function wrapInSetColors(effects) {
    return effects.map((e) => e instanceof expr_1.ExprVec4 || e instanceof EffectLoop ? e : new setcolorexpr_1.SetColorExpr(e));
}
// should be function of loop?
function processEffectMap(eMap) {
    const result = {};
    for (const name in eMap) {
        const val = eMap[name];
        result[name] = wrapInSetColors(val);
    }
    return result;
}
class EffectDictionary {
    constructor(effectMap) {
        this.effectMap = processEffectMap(effectMap);
    }
    toProgramMap(gl, vShader, uniformLocs, fShaders) {
        const programMap = {};
        let needs = {
            neighborSample: false,
            centerSample: false,
            sceneBuffer: false,
            timeUniform: false,
            mouseUniform: false,
            passCount: false,
            extraBuffers: new Set(),
        };
        for (const name in this.effectMap) {
            const effects = this.effectMap[name];
            // wrap the given list of effects as a loop if need be
            const effectLoop = new EffectLoop(effects, { num: 1 });
            if (effectLoop.effects.length === 0) {
                throw new Error("list of effects was empty");
            }
            const programLoop = effectLoop.genPrograms(gl, vShader, uniformLocs, fShaders);
            // walk the tree to the final program
            let atBottom = false;
            let currProgramLoop = programLoop;
            while (!atBottom) {
                if (currProgramLoop.programElement instanceof webglprogramloop_1.WebGLProgramLeaf) {
                    // we traveled right and hit a program, so it must be the last
                    currProgramLoop.last = true;
                    atBottom = true;
                }
                else {
                    // set the current program loop to the last in the list
                    currProgramLoop =
                        currProgramLoop.programElement[currProgramLoop.programElement.length - 1];
                }
            }
            needs = webglprogramloop_1.updateNeeds(needs, programLoop.getTotalNeeds());
            programMap[name] = programLoop;
        }
        return { programMap, needs };
    }
}
exports.EffectDictionary = EffectDictionary;
/** effect loop, which can loop over other effects or effect loops */
class EffectLoop {
    constructor(effects, loopInfo) {
        this.effects = wrapInSetColors(effects);
        this.loopInfo = loopInfo;
    }
    /** @ignore */
    getSampleNum(mult = 1, sliceStart = 0, sliceEnd = this.effects.length) {
        mult *= this.loopInfo.num;
        let acc = 0;
        const sliced = this.effects.slice(sliceStart, sliceEnd);
        for (const e of sliced) {
            acc += e.getSampleNum(mult);
        }
        return acc;
    }
    /**
     * @ignore
     * places effects into loops broken up by sampling effects
     */
    regroup() {
        let sampleCount = 0;
        /** number of samples in all previous */
        let prevSampleCount = 0;
        let prevEffects = [];
        const regroupedEffects = [];
        let prevTarget;
        let currTarget;
        let mustBreakCounter = 0;
        const breakOff = () => {
            mustBreakCounter--;
            if (prevEffects.length > 0) {
                // break off all previous effects into their own loop
                if (prevEffects.length === 1) {
                    // this is to prevent wrapping in another effect loop
                    regroupedEffects.push(prevEffects[0]);
                }
                else {
                    regroupedEffects.push(new EffectLoop(prevEffects, { num: 1 }));
                }
                sampleCount -= prevSampleCount;
                prevEffects = [];
            }
        };
        for (const e of this.effects) {
            const sampleNum = e.getSampleNum();
            prevSampleCount = sampleCount;
            sampleCount += sampleNum;
            if (e instanceof EffectLoop) {
                currTarget = e.loopInfo.target;
                if (e.hasTargetSwitch()) {
                    mustBreakCounter = 2;
                }
            }
            else {
                // if it's not a loop it's assumed the target is that of outer loop
                currTarget = this.loopInfo.target;
            }
            if (sampleCount > 0 ||
                currTarget !== prevTarget ||
                mustBreakCounter > 0) {
                breakOff();
            }
            prevEffects.push(e);
            prevTarget = currTarget;
        }
        // push on all the straggling effects after the grouping is done
        breakOff();
        return regroupedEffects;
    }
    genPrograms(gl, vShader, uniformLocs, shaders) {
        // validate
        const fullSampleNum = this.getSampleNum() / this.loopInfo.num;
        const firstSampleNum = this.getSampleNum(undefined, 0, 1) / this.loopInfo.num;
        const restSampleNum = this.getSampleNum(undefined, 1) / this.loopInfo.num;
        if (!this.hasTargetSwitch() &&
            (fullSampleNum === 0 || (firstSampleNum === 1 && restSampleNum === 0))) {
            const codeBuilder = new codebuilder_1.CodeBuilder(this);
            const program = codeBuilder.compileProgram(gl, vShader, uniformLocs, shaders);
            return program;
        }
        // otherwise, regroup and try again on regrouped loops
        this.effects = this.regroup();
        return new webglprogramloop_1.WebGLProgramLoop(this.effects.map((e) => e.genPrograms(gl, vShader, uniformLocs, shaders)), this.loopInfo, gl);
    }
    /**
     * changes the render target of an effect loop (-1 targest the scene texture;
     * this is used internally)
     */
    target(num) {
        this.loopInfo.target = num;
        return this;
    }
    /** @ignore */
    hasTargetSwitch() {
        for (const e of this.effects) {
            if (e instanceof EffectLoop) {
                if (e.loopInfo.target !== this.loopInfo.target || e.hasTargetSwitch())
                    return true;
            }
        }
        return false;
    }
    /** @ignore */
    regionWrap(space, failure, finalPath = true, not) {
        this.effects = this.effects.map((e, index) => 
        // loops that aren't all the way to the right can't terminate the count ternery
        // don't wrap fcolors in a ternery (it's redundant)
        e instanceof EffectLoop
            ? e.regionWrap(space, failure, index === this.effects.length - 1, not)
            : new setcolorexpr_1.SetColorExpr(regiondecorator_1.region(space, e.brandExprWithRegion(space), index === this.effects.length - 1 && finalPath
                ? !(failure instanceof fragcolorexpr_1.FragColorExpr)
                    ? ternaryexpr_1.ternary(null, failure, fragcolorexpr_1.fcolor())
                    : failure
                : fragcolorexpr_1.fcolor(), not)));
        return this;
    }
}
exports.EffectLoop = EffectLoop;
/** creates an effect loop */
function loop(effects, rep = 1) {
    return new EffectLoop(effects, { num: rep });
}
exports.loop = loop;
/** @ignore */
const V_SOURCE = `attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}\n`;
/** class that can merge effects */
class Merger {
    /**
     * constructs the object that runs the effects
     * @param effects list of effects that define the final effect
     * @param source the source image or texture
     * @param gl the target rendering context
     * @param options additional options for the texture
     */
    constructor(effects, source, gl, options) {
        this.uniformLocs = {};
        /** additional channels */
        this.channels = [];
        this.fShaders = [];
        this.textureMode = source instanceof WebGLTexture;
        // set channels if provided with channels
        if ((options === null || options === void 0 ? void 0 : options.channels) !== undefined)
            this.channels = options === null || options === void 0 ? void 0 : options.channels;
        if (!(effects instanceof EffectDictionary)) {
            effects = new EffectDictionary({ default: effects });
        }
        // add the copy to scene texture if in texture mode
        if (this.textureMode) {
            if (settings_1.settings.verbosity > 1) {
                console.log("we are in texture mode!");
            }
            for (const name in effects.effectMap) {
                const list = effects.effectMap[name];
                list.unshift(loop([scenesampleexpr_1.input()]).target(-1));
            }
        }
        this.source = source;
        this.gl = gl;
        this.options = options;
        // set the viewport
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        // set up the vertex buffer
        const vertexBuffer = this.gl.createBuffer();
        if (vertexBuffer === null) {
            throw new Error("problem creating vertex buffer");
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        const vertexArray = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        const triangles = new Float32Array(vertexArray);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, triangles, this.gl.STATIC_DRAW);
        // save the vertex buffer reference just so we can delete it later
        this.vertexBuffer = vertexBuffer;
        // compile the simple vertex shader (2 big triangles)
        const vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        if (vShader === null) {
            throw new Error("problem creating the vertex shader");
        }
        // save the vertex shader reference just so we can delete it later
        this.vShader = vShader;
        this.gl.shaderSource(vShader, V_SOURCE);
        this.gl.compileShader(vShader);
        // make textures
        this.tex = {
            // make the front texture the source if we're given a texture instead of
            // an image
            back: {
                name: "orig_back",
                tex: source instanceof WebGLTexture
                    ? source
                    : makeTexture(this.gl, this.options),
            },
            front: { name: "orig_front", tex: makeTexture(this.gl, this.options) },
            scene: undefined,
            bufTextures: [],
        };
        // create the framebuffer
        const framebuffer = gl.createFramebuffer();
        if (framebuffer === null) {
            throw new Error("problem creating the framebuffer");
        }
        this.framebuffer = framebuffer;
        const { programMap, needs } = effects.toProgramMap(this.gl, this.vShader, this.uniformLocs, this.fShaders);
        this.programMap = programMap;
        if (needs.sceneBuffer || this.textureMode) {
            // we always create a scene texture if we're in texture mode
            this.tex.scene = {
                name: "scene",
                tex: makeTexture(this.gl, this.options),
            };
        }
        if (programMap["default"] === undefined) {
            throw new Error("no default program");
        }
        this.programLoop = programMap["default"];
        // create x amount of empty textures based on buffers needed
        const channelsNeeded = Math.max(...needs.extraBuffers) + 1;
        const channelsSupplied = this.channels.length;
        if (channelsNeeded > channelsSupplied) {
            throw new Error("not enough channels supplied for this effect");
        }
        for (let i = 0; i < this.channels.length; i++) {
            const texOrImage = this.channels[i];
            if (!(texOrImage instanceof WebGLTexture)) {
                // create a new texture; we will update this with the image source every draw
                const texture = makeTexture(this.gl, this.options);
                this.tex.bufTextures.push({ name: "tex_channel_" + i, tex: texture });
            }
            else {
                // this is already a texture; the user will handle updating this
                this.tex.bufTextures.push({
                    name: "img_channel_" + i,
                    tex: texOrImage,
                });
            }
        }
        if (settings_1.settings.verbosity > 0) {
            console.log(effects);
            console.log(this.programMap);
        }
    }
    /**
     * use the source and channels to draw effect to target context; mouse
     * position (as with all positions) are stored from the bottom left corner as
     * this is how texture data is stored
     * @param timeVal number to set the time uniform to (supply this if you plan to
     * use [[time]])
     * @param mouseX the x position of the mouse (supply this if you plan to use
     * [[mouse]] or [[nmouse]])
     * @param mouseY the y position of the mouse (supply this if you plan to use
     * [[mouse]] or [[nmouse]])
     */
    draw(timeVal = 0, mouseX = 0, mouseY = 0) {
        this.gl.activeTexture(this.gl.TEXTURE0 + settings_1.settings.offset);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex.back.tex);
        sendTexture(this.gl, this.source);
        // TODO only do unbinding and rebinding in texture mode
        // TODO see if we need to unbind
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        // bind the scene buffer
        if (this.programLoop.getTotalNeeds().sceneBuffer &&
            this.tex.scene !== undefined) {
            this.gl.activeTexture(this.gl.TEXTURE1 + settings_1.settings.offset);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex.scene.tex);
            sendTexture(this.gl, this.source);
            // TODO see if we need to unbind
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
        // bind the additional buffers
        let counter = 0;
        for (const b of this.channels) {
            // TODO check for texture limit
            this.gl.activeTexture(this.gl.TEXTURE2 + counter + settings_1.settings.offset);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex.bufTextures[counter].tex);
            sendTexture(this.gl, b);
            // TODO see if we need to unbind (this gets rid of the error)
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            counter++;
        }
        this.programLoop.run(this.gl, this.tex, this.framebuffer, this.uniformLocs, this.programLoop.last, { timeVal: timeVal, mouseX: mouseX, mouseY: mouseY });
    }
    /**
     * delete all resources created by construction of this [[Merger]]; use right before
     * intentionally losing a reference to this merger object. this is useful if you want
     * to construct another [[Merger]] to use new effects
     */
    delete() {
        // TODO do we have to do something with VertexAttribArray?
        // call bind with null on all textures
        for (let i = 0; i < 2 + this.tex.bufTextures.length; i++) {
            // this gets rid of final texture, scene texture and channels
            this.gl.activeTexture(this.gl.TEXTURE0 + i + settings_1.settings.offset);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
        // call bind with null on all vertex buffers (just 1)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        // call bind with null on all frame buffers (just 1)
        // (this might be redundant because this happens at end of draw call)
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        // delete all programs
        this.programLoop.delete(this.gl);
        // delete all textures
        this.gl.deleteTexture(this.tex.front.tex);
        this.gl.deleteTexture(this.tex.back.tex);
        for (const c of this.tex.bufTextures) {
            this.gl.deleteTexture(c.tex);
        }
        // delete all vertex buffers (just 1)
        this.gl.deleteBuffer(this.vertexBuffer);
        // delete all frame buffers (just 1)
        this.gl.deleteFramebuffer(this.framebuffer);
        // delete all vertex shaders (just 1)
        this.gl.deleteShader(this.vShader);
        // delete all fragment shaders
        for (const f of this.fShaders) {
            this.gl.deleteShader(f);
        }
    }
    /**
     * changes the current program loop
     * @param str key in the program map
     */
    changeProgram(str) {
        if (this.programMap[str] === undefined) {
            throw new Error(`program "${str}" doesn't exist on this merger`);
        }
        this.programLoop = this.programMap[str];
    }
}
exports.Merger = Merger;
/** creates a texture given a context and options */
function makeTexture(gl, options) {
    const texture = gl.createTexture();
    if (texture === null) {
        throw new Error("problem creating texture");
    }
    // flip the order of the pixels, or else it displays upside down
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // bind the texture after creating it
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const filterMode = (f) => f === undefined || f === "linear" ? gl.LINEAR : gl.NEAREST;
    // how to map texture element
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode(options === null || options === void 0 ? void 0 : options.minFilterMode));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode(options === null || options === void 0 ? void 0 : options.maxFilterMode));
    if ((options === null || options === void 0 ? void 0 : options.edgeMode) !== "wrap") {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    return texture;
}
exports.makeTexture = makeTexture;
/** copies onto texture */
function sendTexture(gl, src) {
    // if you are using textures instead of images, the user is responsible for
    // updating that texture, so just return
    if (src instanceof WebGLTexture || src === null)
        return;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
}
exports.sendTexture = sendTexture;

},{"./codebuilder":10,"./exprs/expr":24,"./exprs/fragcolorexpr":25,"./exprs/regiondecorator":46,"./exprs/scenesampleexpr":50,"./exprs/setcolorexpr":51,"./exprs/ternaryexpr":54,"./settings":63,"./webglprogramloop":65}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
exports.settings = {
    /**
     * set to 1 if you want reasonable logging for debugging, such as the
     * generated GLSL code and program tree. set to 100 if you want texture debug
     * info (you probably don't want to do this, as it logs many lines every
     * frame!)
     */
    verbosity: 0,
    /** texture offset */
    offset: 0,
};

},{}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandWithRegion = exports.brandWithChannel = exports.captureAndAppend = void 0;
const glslfunctions_1 = require("./glslfunctions");
/** @ignore */
function captureAndAppend(str, reg, suffix) {
    const matches = str.match(reg);
    if (matches === null)
        throw new Error("no match in the given string");
    return str.replace(reg, matches[0] + suffix);
}
exports.captureAndAppend = captureAndAppend;
/** @ignore */
function nameExtractor(sourceLists, extra) {
    const origFuncName = sourceLists.sections[0];
    const ending = origFuncName[origFuncName.length - 1] === ")" ? ")" : "";
    const newFuncName = origFuncName.substr(0, origFuncName.length - 1 - ~~(ending === ")")) +
        extra +
        "(" +
        ending;
    return { origFuncName, newFuncName, ending };
}
/** @ignore */
function brandWithChannel(sourceLists, funcs, needs, funcIndex, samplerNum) {
    samplerNum === undefined || samplerNum === -1
        ? (needs.neighborSample = true)
        : (needs.extraBuffers = new Set([samplerNum]));
    if (samplerNum === undefined || samplerNum === -1)
        return;
    const { origFuncName, newFuncName, ending } = nameExtractor(sourceLists, samplerNum !== undefined ? "_" + samplerNum : "");
    sourceLists.sections[0] = sourceLists.sections[0]
        .split(origFuncName)
        .join(newFuncName);
    funcs[funcIndex] = funcs[funcIndex]
        .split(origFuncName)
        .join(newFuncName)
        .split("uSampler")
        .join("uBufferSampler" + samplerNum);
}
exports.brandWithChannel = brandWithChannel;
/** @ignore */
function brandWithRegion(expr, funcIndex, space) {
    // if it's not a rectangle region we can't do anything so just return
    if (!Array.isArray(space))
        return;
    const sourceLists = expr.sourceLists;
    const funcs = expr.externalFuncs;
    const needs = expr.needs;
    if (expr.regionBranded ||
        (!needs.neighborSample && needs.extraBuffers.size === 0))
        return;
    const { origFuncName, newFuncName, ending } = nameExtractor(sourceLists, "_region");
    const openFuncName = newFuncName.substr(0, newFuncName.length - ~~(ending === ")"));
    const newFuncDeclaration = openFuncName +
        "float r_x_min, float r_y_min, float r_x_max, float r_y_max" +
        (ending === ")" ? ")" : ", ");
    const origTextureName = "texture2D(";
    const newTextureName = "texture2D_region(r_x_min, r_y_min, r_x_max, r_y_max, ";
    // replace name in the external function and `texture2D` and sampler
    // (assumes the sampling function is the first external function)
    funcs[funcIndex] = funcs[funcIndex]
        .split(origFuncName)
        .join(newFuncDeclaration)
        .split(origTextureName)
        .join(newTextureName);
    // shift the original name off the list
    sourceLists.sections.shift();
    // add the close paren if we're opening up a function with 0 args
    if (ending === ")")
        sourceLists.sections.unshift(")");
    // add commas (one less if it is a 0 arg function call)
    for (let i = 0; i < 4 - ~~(ending === ")"); i++) {
        sourceLists.sections.unshift(", ");
    }
    // add the new name to the beginning of the list
    sourceLists.sections.unshift(newFuncName.substr(0, newFuncName.length - ~~(ending === ")")));
    // add values from region data
    sourceLists.values.unshift(...space);
    // put the texture access wrapper at the beginning
    funcs.unshift(glslfunctions_1.glslFuncs.texture2D_region);
    expr.regionBranded = true;
}
exports.brandWithRegion = brandWithRegion;

},{"./glslfunctions":60}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLProgramLoop = exports.WebGLProgramLeaf = exports.updateNeeds = void 0;
const settings_1 = require("./settings");
// update me on change to needs
function updateNeeds(acc, curr) {
    return {
        neighborSample: acc.neighborSample || curr.neighborSample,
        centerSample: acc.centerSample || curr.centerSample,
        sceneBuffer: acc.sceneBuffer || curr.sceneBuffer,
        timeUniform: acc.timeUniform || curr.timeUniform,
        mouseUniform: acc.mouseUniform || curr.mouseUniform,
        passCount: acc.passCount || curr.passCount,
        extraBuffers: new Set([...acc.extraBuffers, ...curr.extraBuffers]),
    };
}
exports.updateNeeds = updateNeeds;
class WebGLProgramLeaf {
    constructor(program, totalNeeds, effects) {
        this.program = program;
        this.totalNeeds = totalNeeds;
        this.effects = effects;
    }
}
exports.WebGLProgramLeaf = WebGLProgramLeaf;
/** @ignore */
function getLoc(programElement, gl, name) {
    gl.useProgram(programElement.program);
    const loc = gl.getUniformLocation(programElement.program, name);
    if (loc === null) {
        throw new Error("could not get the " + name + " uniform location");
    }
    return loc;
}
/** recursive data structure of compiled programs */
class WebGLProgramLoop {
    constructor(programElement, loopInfo, gl) {
        //effects: Expr[];
        this.last = false;
        this.counter = 0;
        this.programElement = programElement;
        this.loopInfo = loopInfo;
        if (this.programElement instanceof WebGLProgramLeaf) {
            if (gl === undefined) {
                throw new Error("program element is a program but context is undefined");
            }
            if (this.programElement.totalNeeds.timeUniform) {
                this.timeLoc = getLoc(this.programElement, gl, "uTime");
            }
            if (this.programElement.totalNeeds.mouseUniform) {
                this.mouseLoc = getLoc(this.programElement, gl, "uMouse");
            }
            if (this.programElement.totalNeeds.passCount) {
                this.countLoc = getLoc(this.programElement, gl, "uCount");
            }
        }
    }
    /** get all needs from all programs */
    getTotalNeeds() {
        // go through needs of program loop
        if (!(this.programElement instanceof WebGLProgramLeaf)) {
            const allNeeds = [];
            for (const p of this.programElement) {
                allNeeds.push(p.getTotalNeeds());
            }
            return allNeeds.reduce(updateNeeds);
        }
        return this.programElement.totalNeeds;
    }
    /**
     * recursively uses all programs in the loop, binding the appropriate
     * textures and setting the appropriate uniforms; the user should only have
     * to call [[draw]] on [[Merger]] and never this function directly
     */
    run(gl, tex, framebuffer, uniformLocs, last, defaultUniforms, outerLoop) {
        let savedTexture;
        if (this.loopInfo.target !== undefined &&
            // if there is a target switch:
            (outerLoop === null || outerLoop === void 0 ? void 0 : outerLoop.loopInfo.target) !== this.loopInfo.target) {
            // swap out the back texture for the channel texture if this loop has
            // an alternate render target
            savedTexture = tex.back;
            if (this.loopInfo.target !== -1) {
                tex.back = tex.bufTextures[this.loopInfo.target];
            }
            else {
                if (tex.scene === undefined) {
                    throw new Error("tried to target -1 but scene texture was undefined");
                }
                tex.back = tex.scene;
            }
            tex.bufTextures[this.loopInfo.target] = savedTexture;
            if (settings_1.settings.verbosity > 99)
                console.log("saved texture: " + savedTexture.name);
        }
        // setup for program leaf
        if (this.programElement instanceof WebGLProgramLeaf) {
            // bind the scene texture if needed
            if (this.programElement.totalNeeds.sceneBuffer) {
                if (tex.scene === undefined) {
                    throw new Error("needs scene buffer, but scene texture is somehow undefined");
                }
                gl.activeTexture(gl.TEXTURE1 + settings_1.settings.offset);
                if (this.loopInfo.target === -1) {
                    gl.bindTexture(gl.TEXTURE_2D, savedTexture.tex);
                }
                else {
                    gl.bindTexture(gl.TEXTURE_2D, tex.scene.tex);
                }
            }
            // bind all extra channel textures if needed
            for (const n of this.programElement.totalNeeds.extraBuffers) {
                gl.activeTexture(gl.TEXTURE2 + n + settings_1.settings.offset);
                gl.bindTexture(gl.TEXTURE_2D, tex.bufTextures[n].tex);
            }
            // use the current program
            gl.useProgram(this.programElement.program);
            // apply all uniforms
            for (const effect of this.programElement.effects) {
                effect.applyUniforms(gl, uniformLocs);
            }
            // set time uniform if needed
            if (this.programElement.totalNeeds.timeUniform) {
                if (this.timeLoc === undefined ||
                    defaultUniforms.timeVal === undefined) {
                    throw new Error("time or location is undefined");
                }
                gl.uniform1f(this.timeLoc, defaultUniforms.timeVal);
            }
            // set mouse uniforms if needed
            if (this.programElement.totalNeeds.mouseUniform) {
                if (this.mouseLoc === undefined ||
                    defaultUniforms.mouseX === undefined ||
                    defaultUniforms.mouseY === undefined) {
                    throw new Error("mouse uniform or location is undefined");
                }
                gl.uniform2f(this.mouseLoc, defaultUniforms.mouseX, defaultUniforms.mouseY);
            }
            // set count uniform if needed
            if (this.programElement.totalNeeds.passCount && outerLoop !== undefined) {
                if (this.countLoc === undefined) {
                    throw new Error("count location is undefined");
                }
                if (outerLoop !== undefined) {
                    gl.uniform1i(this.countLoc, outerLoop.counter);
                }
                this.counter++;
                const mod = outerLoop === undefined ? 1 : outerLoop.loopInfo.num;
                this.counter %= mod;
            }
        }
        for (let i = 0; i < this.loopInfo.num; i++) {
            const newLast = i === this.loopInfo.num - 1;
            if (this.programElement instanceof WebGLProgramLeaf) {
                if (newLast && last && this.last) {
                    // we are on the final pass of the final loop, so draw screen by
                    // setting to the default framebuffer
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                }
                else {
                    // we have to bounce between two textures
                    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                    // use the framebuffer to write to front texture
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.front.tex, 0);
                }
                // allows us to read from `texBack`
                // default sampler is 0, so `uSampler` uniform will always sample from texture 0
                gl.activeTexture(gl.TEXTURE0 + settings_1.settings.offset);
                gl.bindTexture(gl.TEXTURE_2D, tex.back.tex);
                // use our last program as the draw program
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                if (settings_1.settings.verbosity > 99) {
                    console.log("intermediate back", tex.back.name);
                    console.log("intermediate front", tex.front.name);
                }
                // swap back and front
                [tex.back, tex.front] = [tex.front, tex.back];
                // deactivate and unbind all the channel textures needed
                for (const n of this.programElement.totalNeeds.extraBuffers) {
                    gl.activeTexture(gl.TEXTURE2 + n + settings_1.settings.offset);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
                gl.activeTexture(gl.TEXTURE1 + settings_1.settings.offset);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
            else {
                if (this.loopInfo.func !== undefined) {
                    this.loopInfo.func(i);
                }
                for (const p of this.programElement) {
                    p.run(gl, tex, framebuffer, uniformLocs, newLast, defaultUniforms, this // this is now the outer loop
                    );
                }
            }
        }
        // swap the textures back if we were temporarily using a channel texture
        if (savedTexture !== undefined) {
            const target = this.loopInfo.target;
            if (settings_1.settings.verbosity > 99) {
                console.log("pre final back", tex.back.name);
                console.log("pre final front", tex.front.name);
            }
            // back texture is really the front texture because it was just swapped
            if (this.loopInfo.target !== -1) {
                tex.bufTextures[target] = tex.back;
            }
            else {
                if (tex.scene === undefined) {
                    throw new Error("tried to replace -1 but scene texture was undefined");
                }
                tex.scene = tex.back;
            }
            tex.back = savedTexture;
            if (settings_1.settings.verbosity > 99) {
                console.log("post final back", tex.back.name);
                console.log("post final front", tex.front.name);
                console.log("channel texture", tex.bufTextures[target].name);
            }
        }
    }
    delete(gl) {
        if (this.programElement instanceof WebGLProgramLeaf) {
            gl.deleteProgram(this.programElement.program);
        }
        else {
            for (const p of this.programElement) {
                p.delete(gl);
            }
        }
    }
}
exports.WebGLProgramLoop = WebGLProgramLoop;

},{"./settings":63}]},{},[8]);
// @ts-nocheck
{
  const addToProto = (pr, name, add) => {
    if (p5.prototype.hasOwnProperty(name)) {
      throw new Error("p5 already has this: " + name);
    }
    pr[name] = add;
  };

  const pr = p5.prototype;
  // this avoids collisions with names in p5 and changes to camelCase
  addToProto(pr, "foggyRays", MP.foggyrays);
  addToProto(pr, "vignette", MP.vignette);
  addToProto(pr, "blurAndTrace", MP.blurandtrace);
  addToProto(pr, "lightBands", MP.lightbands);
  addToProto(pr, "noiseDisplacement", MP.noisedisplacement);
  addToProto(pr, "oldFilm", MP.oldfilm);
  addToProto(pr, "kaleidoscope", MP.kaleidoscope);
  addToProto(pr, "effectLoop", MP.loop);
  addToProto(pr, "gauss", MP.gauss);
  addToProto(pr, "fColor", MP.fcolor);
  addToProto(pr, "vec2", MP.vec2);
  addToProto(pr, "vec3", MP.vec3);
  addToProto(pr, "vec4", MP.vec4);
  addToProto(pr, "pVec2", MP.pvec2);
  addToProto(pr, "pVec3", MP.pvec3);
  addToProto(pr, "pVec4", MP.pvec4);
  addToProto(pr, "op", MP.op);
  addToProto(pr, "blur2d", MP.blur2d);
  addToProto(pr, "len", MP.len);
  addToProto(pr, "normalize", MP.norm);
  addToProto(pr, "pixel", MP.pixel);
  addToProto(pr, "pos", MP.pos);
  addToProto(pr, "center", MP.center);
  addToProto(pr, "input", MP.input);
  addToProto(pr, "bright", MP.brightness);
  addToProto(pr, "contrast", MP.contrast);
  addToProto(pr, "grain", MP.grain);
  addToProto(pr, "getComp", MP.getcomp);
  addToProto(pr, "get2Comp", MP.get2comp);
  addToProto(pr, "get3Comp", MP.get3comp);
  addToProto(pr, "get4Comp", MP.get4comp);
  addToProto(pr, "changeComp", MP.changecomp);
  addToProto(pr, "rgbToHsv", MP.rgb2hsv);
  addToProto(pr, "hsvToRgb", MP.hsv2rgb);
  addToProto(pr, "time", MP.time);
  addToProto(pr, "a1", MP.a1);
  addToProto(pr, "a2", MP.a2);
  addToProto(pr, "fxaa", MP.fxaa);
  addToProto(pr, "channel", MP.channel);
  addToProto(pr, "depthOfField", MP.dof);
  addToProto(pr, "trueDepth", MP.truedepth);
  addToProto(pr, "godrays", MP.godrays);
  addToProto(pr, "depthToOcclusion", MP.depth2occlusion);
  addToProto(pr, "resolution", MP.resolution);
  addToProto(pr, "mouse", MP.mouse);
  addToProto(pr, "rotate2d", MP.rotate);
  addToProto(pr, "translate2d", MP.translate);
  addToProto(pr, "nMouse", MP.nmouse);
  addToProto(pr, "perlin", MP.perlin);
  addToProto(pr, "simplex", MP.simplex);
  addToProto(pr, "motionBlur", MP.motionblur);
  addToProto(pr, "randomFloat", MP.random);
  addToProto(pr, "sobel", MP.sobel);
  addToProto(pr, "bloom", MP.bloom);
  addToProto(pr, "monochrome", MP.monochrome);
  addToProto(pr, "invert", MP.invert);
  addToProto(pr, "edge", MP.edge);
  addToProto(pr, "edgeColor", MP.edgecolor);
  addToProto(pr, "ternary", MP.ternary);
  addToProto(pr, "region", MP.region);
  addToProto(pr, "cFloat", MP.cfloat);
  addToProto(pr, "cVec2", MP.cvec2);
  addToProto(pr, "cVec3", MP.cvec3);
  addToProto(pr, "cVec4", MP.cvec4);
  addToProto(pr, "mut", MP.mut);
  addToProto(pr, "basicFloat", MP.float);
  addToProto(pr, "pFloat", MP.pfloat);
  addToProto(pr, "tag", MP.tag);

  addToProto(pr, "__info", {
    replaced: false,
    orig: null,
    canvas: null,
    gl: null,
    verbosity: 0,
    startTime: 0,
    mousePos: { x: 0, y: 0 },
    effects: [],
    channels: [],
  });

  console.log(pr.__info);

  addToProto(pr, "addEffects", function () {
    pr.__info.effects.push(...arguments);
  });

  addToProto(pr, "addChannels", function () {
    pr.__info.channels.push(...arguments);
  });

  const info = p5.prototype.__info;

  function mpInit() {
    if (info.verbosity > 0) console.log("mp init");
  }

  function mpPre() {
    if (info.replaced || !info.effects) return;
    if (info.verbosity > 0) console.log("mp pre x1");

    info.startTime = new Date().getTime();

    info.orig = document.getElementById("defaultCanvas0");

    if (!info.orig) throw new Error("mergepass couldn't get the p5 canvas");
    const parent = info.orig.parentElement;
    parent.style.position = "relative";

    info.canvas = document.createElement("canvas");

    info.canvas.width = info.orig.width;
    info.canvas.height = info.orig.height;
    info.canvas.style.width = info.orig.style.width;
    info.canvas.style.height = info.orig.style.height;

    info.gl = info.canvas.getContext("webgl2");
    if (!info.gl) throw new Error("mergepass couldn't get the webgl2 context");

    parent.appendChild(info.canvas);

    info.merger = new MP.Merger(pr.__info.effects, info.orig, info.gl, {
      channels: pr.__info.channels,
    });

    const align = (c, z) => {
      c.style.position = "absolute";
      c.style.left = 0;
      c.style.top = 0;
      c.style.zIndex = z;
    };

    align(info.canvas, 0);
    align(info.orig, 1);

    info.orig.style.visibility = "hidden";

    info.canvas.addEventListener("mousemove", (e) => {
      const rect = info.orig.getBoundingClientRect();
      info.mousePos.x =
        (info.canvas.width * (e.clientX - rect.left)) / rect.width;
      info.mousePos.y =
        (info.canvas.height * (rect.height - (e.clientY - rect.top))) /
        rect.height;
    });

    info.replaced = true;
  }

  function mpPost() {
    if (info.verbosity > 1) console.log("mp post");
    if (!info.effects) return;
    const time = info.startTime - new Date().getTime();
    info.merger.draw(time / 1000, info.mousePos.x, info.mousePos.y);
  }

  p5.prototype.registerMethod("pre", mpPre);
  p5.prototype.registerMethod("init", mpInit);
  p5.prototype.registerMethod("post", mpPost);
}
