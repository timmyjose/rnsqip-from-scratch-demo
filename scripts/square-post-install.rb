#!/usr/bin/env ruby

# Source: https://github.com/kuldip-simform
# https://github.com/square/in-app-payments-react-native-plugin/issues/236#issuecomment-2071933733

require 'xcodeproj'
require 'set'

project_file, target_name = ARGV

puts "Sorting sources in #{project_file} for target #{target_name}"

project = Xcodeproj::Project.open(project_file)
target = project.targets.select { |t| t.name == target_name }.first
square_framework_run_script_index = target.build_phases.index { |b|
    name = b.name if b.respond_to? :name
    name == "Configure SQIP SDK for iOS" 
}
puts "Square Framework Run Script index: #{square_framework_run_script_index} Total build phases: #{target.build_phases.count - 1}"
if square_framework_run_script_index.nil? == false
    puts "Moving Square Framework Run Script from #{square_framework_run_script_index} to the #{target.build_phases.count - 1} index"
    target.build_phases.move_from(square_framework_run_script_index, target.build_phases.count - 1)
end
project.save
