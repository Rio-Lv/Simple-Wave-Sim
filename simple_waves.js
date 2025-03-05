const width = 800;
const height = 800;
const res = 200;
const space = width / res;

function setup() {
  createCanvas(width, height);
  pixelDensity(1);
}

let t = 0;
const zoom = 0.8;

const create_wave = (t, i, j, sx, sy, f, a) => {
  const dx = sx - i;
  const dy = sy - j;
  const d = sqrt(dx ** 2 + dy ** 2) * zoom;
  return a * sin(d - f * t);
};

function draw() {
  t += 0.02;
  loadPixels();

  const ix = -0.1* res;
  const iy = 0.2 * res*2 + res/2;
  const wall_len = 20;
  const wall_width = res / 4;
  const wall_depth = wall_width;
  const wall_sx = res/2 - wall_width / 2;
  const wall_sy = res/2 - wall_depth / 2;
  const gap = wall_width / wall_len;


  
  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      // Calculate primary wave once per cell
      let wave_1 = create_wave(t, i, j, ix, iy, 10, 70);

      // Calculate wall wave contribution
      let wall_sum = 0;
      for (let w = 0; w < 2; w++) {
        for (let v = 0; v < wall_len; v++) {
          const sx = wall_sx + w * gap * 50;
          const sy = wall_sy + v * gap;
          wall_sum += create_wave(t, i, j, sx, sy, 5, 128/ wall_len);
        }
      }

      const brightness = wall_sum + wave_1

      // Apply brightness across the larger block (reduces pixel-level update calls)
      const x = floor(i * space);
      const y = floor(j * space);

      for (let dx = 0; dx < space; dx++) {
        for (let dy = 0; dy < space; dy++) {
          const index = 4 * ((y + dy) * width + (x + dx));
          pixels[index] = brightness;
          pixels[index + 1] = brightness;
          pixels[index + 2] = brightness;
          pixels[index + 3] = 255;
        }
      }
    }
  }
  
  updatePixels();
}
