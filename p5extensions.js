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
    if (info.replaced) return;
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
    if (!info.merger) return;
    const time = info.startTime - new Date().getTime();
    info.merger.draw(time / 1000, info.mousePos.x, info.mousePos.y);
  }

  p5.prototype.registerMethod("pre", mpPre);
  p5.prototype.registerMethod("init", mpInit);
  p5.prototype.registerMethod("post", mpPost);
}
