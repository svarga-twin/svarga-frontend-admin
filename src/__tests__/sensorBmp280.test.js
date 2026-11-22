import { describe, expect, it } from "vitest";
import { SENSOR_LABEL, SENSOR_UNIT, mergeCondition, tekananInfo } from "../lib/env";

describe("DHT11 + BMP280", () => {
  const snapshot = {
    is_stale: false,
    updated_at: "2026-11-22T10:00:00+07:00",
    readings: {
      temperature: { value: 29.9 }, humidity: { value: 79 },
      pressure: { value: 1010.5 }, altitude: { value: 22.9 },
    },
  };

  it("membaca pressure & altitude dari snapshot", () => {
    const c = mergeCondition({ sensor: {} }, snapshot);
    expect(c.suhu).toBe(29.9);
    expect(c.kelembaban).toBe(79);
    expect(c.tekanan).toBe(1010.5);
    expect(c.ketinggian).toBe(22.9);
  });

  it("tekanan & ketinggian null bila BMP280 tidak mengirim", () => {
    const c = mergeCondition({ sensor: {} }, { readings: { temperature: { value: 30 }, humidity: { value: 70 } } });
    expect(c.tekanan).toBeNull();
    expect(c.ketinggian).toBeNull();
  });

  it("label & satuan tersedia", () => {
    expect(SENSOR_UNIT.pressure).toBe("hPa");
    expect(SENSOR_UNIT.altitude).toBe("m");
    expect(SENSOR_LABEL.humidity).toBe("Kelembapan");
    expect(tekananInfo(1010.5).label).toBe("Normal");
  });
});
