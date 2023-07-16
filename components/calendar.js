import axios from "axios";

const common = "https://lonqie.github.io/SchaleDB/data/common.json"
const localization = "https://lonqie.github.io/SchaleDB/data/cn/localization.json"
const raids = "https://lonqie.github.io/SchaleDB/data/cn/raids.min.json"
const student_cn = "https://lonqie.github.io/SchaleDB/data/cn/students.min.json"
const student_jp = "https://lonqie.github.io/SchaleDB/data/jp/students.min.json"

const getItem = async (dict, key, value) => {
  for (const item in dict) {
    if (item[key] === value)
      return item
  }
  return null
}

const getData = async (url) => {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await axios.get(url)
      if (res.status_code === 200) {
        console.log(res)
        return res
      }
    } catch (err) {
      console.log(err)
      continue
    }
  }
  return null
}

const extractCalendarData = async (server) => {
  let eventList = []

  const commonData = await getData(common)
  const studentData = await getData(student_cn)
  const localizationData = await getData(localization)
  const raidData = await getData(raids)
  if (!commonData || !studentData || !localizationData || !raidData)
    return null

  const data = server === "jp" ? common_data.regions[0] : common_data.regions[1]
  // gacha
  for (let gacha of data.current_gacha) {
    const characters = gacha.characters;
    for (let character of characters) {
      const stu_info = await getItem(student_data, "Id", character);
      const title = "本期卡池: " + stu_info.Name;
      const start_time = new Date(gacha.start * 1000).toLocaleString();
      const end_time = new Date(gacha.end * 1000).toLocaleString();
      event_list.push({ title, start: start_time, end: end_time });
    }
  }

  // event
  for (let event of data.current_events) {
    let event_rerun = "";
    let event_id = event.event;

    if (event_id > 1000) {
      event_id = String(event_id).slice(2);
      event_rerun = "(复刻)";
    }

    const event_name = localization_data.EventName[String(event_id)] + event_rerun;
    const start_time = new Date(event.start * 1000).toLocaleString();
    const end_time = new Date(event.end * 1000).toLocaleString();
    event_list.push({ title: event_name, start: start_time, end: end_time });
  }

  // raid
  for (let raid of data.current_raid) {
    const raid_id = raid.raid;
    let title = "";

    if (raid_id < 999) {
      const raid_info = await get_item(raid_data.Raid, "Id", raid_id);
      title = "总力战: " + raid_info.Name;
      if (raid.terrain) {
        title += `(${raid.terrain})`;
      }
    }

    if (raid_id > 999 && raid_id < 99999) {
      const dungeon_types = {
        Shooting: "射击",
        Defense: "防御",
        Destruction: "突破",
      };
      const raid_info = await get_item(raid_data.TimeAttack, "Id", raid_id);
      title = raid_info.DungeonType;
      if (raid_info.DungeonType in dungeon_types) {
        title = dungeon_types[raid_info.DungeonType];
      }
      title += "演习";
      if (raid_info.Terrain) {
        title += `(${raid_info.Terrain})`;
      }
    }

    if (raid_id > 800000 && raid_id < 900000) {
      const raid_info = await get_item(raid_data.WorldRaid, "Id", raid_id);
      title = raid_info.Name;
    }

    if (title !== "") {
      const start_time = new Date(raid.start * 1000).toLocaleString();
      const end_time = new Date(raid.end * 1000).toLocaleString();
      event_list.push({ title, start: start_time, end: end_time });
    }
  }

  return event_list;
}