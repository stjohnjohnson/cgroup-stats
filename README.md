# cgroup-stats
[![version](https://img.shields.io/npm/v/cgroup-stats.svg)](cgroup-stats)
[![downloads](https://img.shields.io/npm/dt/cgroup-stats.svg)](cgroup-stats)
[![build status](https://app.wercker.com/status/69dad692abfba7ef1f1cdcbd1d162792/s "wercker status")](https://app.wercker.com/project/bykey/69dad692abfba7ef1f1cdcbd1d162792)

Node Module for reading [Control Group][cgroup] usage stats


Currently this reads the following data:
 - [memory.usage_in_bytes][memory] - current usage for memory
 - [memory.max_usage_in_bytes][memory] - max memory usage recorded
 - [cpuacct.stat.user][cpuacct] - time spent by tasks of the cgroup in user mode
 - [cpuacct.stat.system][cpuacct] - time spent by tasks of the cgroup in kernel mode

**This only works on Linux operating systems**

## Usage

```javascript
var cgroupStats = require('cgroup-stats');

cgroupStats(function (error, data) {
    console.log(data.memory.usage_in_bytes);
    console.log(data.memory.max_usage_in_bytes);
    console.log(data.cpuacct.stat.user);
    console.log(data.cpuacct.stat.system);
});
```

## License
Code licensed under the MIT license.  See `LICENSE` file for terms.

 [cgroup]: https://www.kernel.org/doc/Documentation/cgroups/cgroups.txt
 [memory]: https://www.kernel.org/doc/Documentation/cgroups/memory.txt
 [cpuacct]: https://www.kernel.org/doc/Documentation/cgroups/cpuacct.txt
